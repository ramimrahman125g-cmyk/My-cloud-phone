package com.example.cloudphone.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cloudphone.data.BashInterpreter
import com.example.cloudphone.data.CloudAppId
import com.example.cloudphone.data.CloudAppInfo
import com.example.cloudphone.data.CloudAppsRepository
import com.example.cloudphone.data.CloudDeviceSpecs
import com.example.cloudphone.data.CloudPackageManager
import com.example.cloudphone.data.FsDirectory
import com.example.cloudphone.data.FsFile
import com.example.cloudphone.data.FsNode
import com.example.cloudphone.data.StorageBreakdown
import com.example.cloudphone.data.TerminalLine
import com.example.cloudphone.data.VirtualFileSystem
import com.example.cloudphone.data.YouTubeRepository
import com.example.cloudphone.data.YouTubeVideo
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class CloudPhoneUiState(
    val specs: CloudDeviceSpecs = CloudDeviceSpecs(),
    val activeApp: CloudAppId = CloudAppId.HOME,
    val appBackStack: List<CloudAppId> = listOf(CloudAppId.HOME),
    val apps: List<CloudAppInfo> = CloudAppsRepository.getInitialApps(),
    val ramUsedMb: Int = 1420,
    val storageBreakdown: StorageBreakdown = StorageBreakdown(),
    val isRamBoosting: Boolean = false,
    val ramBoostMessage: String? = null,
    
    // Terminal state
    val terminalLines: List<TerminalLine> = listOf(
        TerminalLine("Welcome to CloudDroid Linux Container (x86_64)", isSystem = true),
        TerminalLine("4.0 GB RAM • 64.0 GB NVMe Cloud ROM (Google Cloud)", isSystem = true),
        TerminalLine("Zero local phone storage used. All files are cloud-hosted.", isSuccess = true),
        TerminalLine("Type 'help' for available commands, or 'neofetch' for system info.\n")
    ),
    val terminalInput: String = "",
    val currentWorkingDir: String = "/home/cloud",
    val isExecutingCommand: Boolean = false,
    
    // YouTube state
    val youtubeVideos: List<YouTubeVideo> = YouTubeRepository.getVideos(),
    val selectedVideo: YouTubeVideo? = null,
    val isVideoPlaying: Boolean = true,
    val videoProgress: Float = 0.25f,
    val youtubeSearchQuery: String = "",
    val selectedYoutubeCategory: String = "All",
    
    // Play Store state
    val playStoreSearchQuery: String = "",
    val selectedPlayStoreCategory: String = "All",
    val selectedPlayStoreApp: CloudAppInfo? = null,
    val isInstallingAppId: CloudAppId? = null,
    
    // Cloud Drive state
    val currentDrivePath: String = "/home/cloud",
    val selectedFileForViewing: FsFile? = null,
    val editedFileContent: String = "",
    
    // Network test state
    val isRunningSpeedTest: Boolean = false,
    val speedTestDownload: String = "948.5 Mbps",
    val speedTestUpload: String = "882.1 Mbps",
    val speedTestPing: String = "4 ms"
)

class CloudPhoneViewModel : ViewModel() {
    private val fileSystem = VirtualFileSystem()
    private val packageManager = CloudPackageManager()
    private val specs = CloudDeviceSpecs()
    private val bashInterpreter = BashInterpreter(fileSystem, packageManager, specs)

    private val _uiState = MutableStateFlow(CloudPhoneUiState())
    val uiState: StateFlow<CloudPhoneUiState> = _uiState.asStateFlow()

    private var historyIndex = -1

    init {
        updateStorageAndRam()
    }

    fun openApp(appId: CloudAppId) {
        _uiState.update { current ->
            val newStack = if (appId == CloudAppId.HOME) {
                listOf(CloudAppId.HOME)
            } else {
                current.appBackStack + appId
            }
            current.copy(
                activeApp = appId,
                appBackStack = newStack
            )
        }
        updateStorageAndRam()
    }

    fun navigateBack(): Boolean {
        val currentStack = _uiState.value.appBackStack
        if (currentStack.size > 1) {
            val poppedStack = currentStack.dropLast(1)
            val previousApp = poppedStack.last()
            _uiState.update {
                it.copy(
                    activeApp = previousApp,
                    appBackStack = poppedStack,
                    selectedVideo = if (previousApp != CloudAppId.YOUTUBE) null else it.selectedVideo
                )
            }
            return true
        } else if (_uiState.value.activeApp != CloudAppId.HOME) {
            _uiState.update {
                it.copy(
                    activeApp = CloudAppId.HOME,
                    appBackStack = listOf(CloudAppId.HOME)
                )
            }
            return true
        }
        return false
    }

    // ==========================================
    // RAM & Storage Management
    // ==========================================
    private fun updateStorageAndRam() {
        val installedApps = _uiState.value.apps.filter { it.isInstalled }
        val appsSizeGb = installedApps.sumOf { it.appSizeMb } / 1024.0
        val packagesSizeGb = packageManager.getTotalInstalledSizeMb() / 1024.0
        val totalAppSizeGb = appsSizeGb + packagesSizeGb

        val baseRam = 950
        val appsRam = when (_uiState.value.activeApp) {
            CloudAppId.HOME -> 180
            CloudAppId.TERMINAL -> 320
            CloudAppId.YOUTUBE -> 680
            CloudAppId.PLAY_STORE -> 420
            CloudAppId.CLOUD_FILES -> 240
            CloudAppId.CLOUD_CODE -> 410
            CloudAppId.SSH_CLIENT -> 210
            CloudAppId.SNAKE_GAME -> 160
            CloudAppId.SETTINGS -> 140
            CloudAppId.TASK_MANAGER -> 130
        }

        val totalUsedRam = (baseRam + appsRam).coerceAtMost(3800)

        _uiState.update {
            it.copy(
                ramUsedMb = totalUsedRam,
                storageBreakdown = StorageBreakdown(
                    totalGb = 64.0,
                    systemOsGb = 5.2,
                    installedAppsGb = (totalAppSizeGb + 2.0).coerceAtLeast(2.0),
                    userFilesGb = 1.4,
                    cloudCacheGb = 0.8
                )
            )
        }
    }

    fun boostRam() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRamBoosting = true, ramBoostMessage = "Releasing inactive cloud container buffers...") }
            delay(900)
            val freedMb = 540
            _uiState.update {
                it.copy(
                    isRamBoosting = false,
                    ramUsedMb = (it.ramUsedMb - freedMb).coerceAtLeast(850),
                    ramBoostMessage = "Freed $freedMb MB of 4.0 GB Cloud RAM! Background caches purged."
                )
            }
            delay(3000)
            _uiState.update { it.copy(ramBoostMessage = null) }
        }
    }

    fun clearCloudCache() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    storageBreakdown = it.storageBreakdown.copy(cloudCacheGb = 0.1),
                    ramBoostMessage = "Purged 700 MB of temporary Cloud cache. 64GB ROM optimized!"
                )
            }
            delay(3000)
            _uiState.update { it.copy(ramBoostMessage = null) }
        }
    }

    fun runSpeedTest() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRunningSpeedTest = true) }
            delay(1200)
            _uiState.update {
                it.copy(
                    isRunningSpeedTest = false,
                    speedTestDownload = "${(940..985).random()}.${(1..9).random()} Mbps",
                    speedTestUpload = "${(880..930).random()}.${(1..9).random()} Mbps",
                    speedTestPing = "${(3..6).random()} ms"
                )
            }
        }
    }

    // ==========================================
    // Termux / Terminal Commands
    // ==========================================
    fun onTerminalInputChange(newText: String) {
        _uiState.update { it.copy(terminalInput = newText) }
    }

    fun executeTerminalCommand(customCmd: String? = null) {
        val cmd = (customCmd ?: _uiState.value.terminalInput).trim()
        if (cmd.isEmpty()) return

        val prompt = if (bashInterpreter.inSshSession) {
            "[${bashInterpreter.sshRemoteHost}]$ "
        } else {
            "cloud@gcp-cloudphone:${fileSystem.currentDirectory.getAbsolutePath()}$ "
        }

        if (cmd == "clear") {
            _uiState.update {
                it.copy(
                    terminalLines = emptyList(),
                    terminalInput = "",
                    currentWorkingDir = fileSystem.currentDirectory.getAbsolutePath()
                )
            }
            historyIndex = -1
            return
        }

        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isExecutingCommand = true,
                    terminalLines = it.terminalLines + TerminalLine("$prompt$cmd", isCommand = true),
                    terminalInput = ""
                )
            }

            val output = bashInterpreter.execute(cmd)
            updateStorageAndRam()

            _uiState.update {
                it.copy(
                    isExecutingCommand = false,
                    terminalLines = it.terminalLines + output,
                    currentWorkingDir = fileSystem.currentDirectory.getAbsolutePath()
                )
            }
            historyIndex = -1
        }
    }

    fun onTerminalModifierKey(key: String) {
        when (key) {
            "ESC" -> {
                _uiState.update { it.copy(terminalInput = "") }
            }
            "TAB" -> {
                // Autocomplete
                val current = _uiState.value.terminalInput
                val tokens = current.split(" ")
                val lastToken = tokens.lastOrNull() ?: ""
                val matches = fileSystem.currentDirectory.children.keys.filter { it.startsWith(lastToken) }
                if (matches.size == 1) {
                    val completed = (tokens.dropLast(1) + matches.first()).joinToString(" ")
                    _uiState.update { it.copy(terminalInput = completed) }
                }
            }
            "UP" -> {
                if (bashInterpreter.commandHistory.isNotEmpty()) {
                    if (historyIndex == -1) historyIndex = bashInterpreter.commandHistory.size - 1
                    else if (historyIndex > 0) historyIndex--
                    val histCmd = bashInterpreter.commandHistory.getOrNull(historyIndex) ?: ""
                    _uiState.update { it.copy(terminalInput = histCmd) }
                }
            }
            "DOWN" -> {
                if (historyIndex != -1) {
                    if (historyIndex < bashInterpreter.commandHistory.size - 1) {
                        historyIndex++
                        val histCmd = bashInterpreter.commandHistory[historyIndex]
                        _uiState.update { it.copy(terminalInput = histCmd) }
                    } else {
                        historyIndex = -1
                        _uiState.update { it.copy(terminalInput = "") }
                    }
                }
            }
            else -> {
                _uiState.update { it.copy(terminalInput = it.terminalInput + key) }
            }
        }
    }

    // ==========================================
    // Play Store Actions
    // ==========================================
    fun onPlayStoreSearchQueryChange(query: String) {
        _uiState.update { it.copy(playStoreSearchQuery = query) }
    }

    fun onSelectPlayStoreCategory(category: String) {
        _uiState.update { it.copy(selectedPlayStoreCategory = category) }
    }

    fun selectPlayStoreApp(app: CloudAppInfo?) {
        _uiState.update { it.copy(selectedPlayStoreApp = app) }
    }

    fun toggleInstallApp(appId: CloudAppId) {
        viewModelScope.launch {
            _uiState.update { it.copy(isInstallingAppId = appId) }
            delay(1200) // Simulate cloud download & installation onto 64GB ROM
            _uiState.update { current ->
                val updatedApps = current.apps.map { app ->
                    if (app.id == appId) {
                        app.copy(isInstalled = !app.isInstalled)
                    } else app
                }
                current.copy(
                    apps = updatedApps,
                    isInstallingAppId = null,
                    selectedPlayStoreApp = updatedApps.firstOrNull { it.id == appId }
                )
            }
            updateStorageAndRam()
        }
    }

    // ==========================================
    // YouTube Cloud Actions
    // ==========================================
    fun onYoutubeSearchQueryChange(query: String) {
        _uiState.update { it.copy(youtubeSearchQuery = query) }
    }

    fun onSelectYoutubeCategory(cat: String) {
        _uiState.update { it.copy(selectedYoutubeCategory = cat) }
    }

    fun selectVideo(video: YouTubeVideo?) {
        _uiState.update { it.copy(selectedVideo = video, isVideoPlaying = true, videoProgress = 0f) }
    }

    fun toggleVideoPlayPause() {
        _uiState.update { it.copy(isVideoPlaying = !it.isVideoPlaying) }
    }

    // ==========================================
    // Cloud Drive / File Explorer Actions
    // ==========================================
    fun getDirectoryContents(path: String = _uiState.value.currentDrivePath): List<FsNode> {
        val dir = fileSystem.resolvePath(path)
        return if (dir is FsDirectory) {
            dir.children.values.toList().sortedWith(compareBy({ !it.isDirectory }, { it.name }))
        } else emptyList()
    }

    fun navigateDriveFolder(path: String) {
        val node = fileSystem.resolvePath(path)
        if (node is FsDirectory) {
            _uiState.update { it.copy(currentDrivePath = node.getAbsolutePath()) }
        }
    }

    fun openFileForViewing(file: FsFile) {
        _uiState.update {
            it.copy(
                selectedFileForViewing = file,
                editedFileContent = file.content
            )
        }
    }

    fun closeFileViewer() {
        _uiState.update { it.copy(selectedFileForViewing = null, editedFileContent = "") }
    }

    fun onFileContentChange(newContent: String) {
        _uiState.update { it.copy(editedFileContent = newContent) }
    }

    fun saveEditedFile() {
        val file = _uiState.value.selectedFileForViewing ?: return
        file.content = _uiState.value.editedFileContent
        file.modifiedTime = System.currentTimeMillis()
        closeFileViewer()
    }

    fun createNewCloudFile(name: String, content: String) {
        val fullPath = "${_uiState.value.currentDrivePath}/$name"
        fileSystem.createFile(fullPath, content, isExecutable = name.endsWith(".sh"))
        updateStorageAndRam()
    }

    fun createNewCloudFolder(name: String) {
        val fullPath = "${_uiState.value.currentDrivePath}/$name"
        fileSystem.mkdirs(fullPath)
        updateStorageAndRam()
    }

    fun deleteCloudNode(path: String) {
        fileSystem.deleteNode(path)
        updateStorageAndRam()
    }
}
