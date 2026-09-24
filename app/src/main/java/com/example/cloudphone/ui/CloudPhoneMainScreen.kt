package com.example.cloudphone.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.cloudphone.data.CloudAppId

@Composable
fun CloudPhoneMainScreen(
    viewModel: CloudPhoneViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showRecents by remember { mutableStateOf(false) }

    BackHandler {
        if (showRecents) {
            showRecents = false
        } else {
            viewModel.navigateBack()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Android Cloud OS Top Status Bar
            CloudStatusBar(ramUsedMb = uiState.ramUsedMb)

            // Dynamic Main App Window
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                AnimatedContent(
                    targetState = uiState.activeApp,
                    transitionSpec = { fadeIn() togetherWith fadeOut() },
                    label = "AppScreenTransition"
                ) { targetApp ->
                    when (targetApp) {
                        CloudAppId.HOME -> {
                            CloudHomeScreen(
                                uiState = uiState,
                                onOpenApp = { viewModel.openApp(it) },
                                onBoostRam = { viewModel.boostRam() },
                                onClearCache = { viewModel.clearCloudCache() }
                            )
                        }
                        CloudAppId.TERMINAL -> {
                            TermuxTerminalScreen(
                                uiState = uiState,
                                onInputChange = { viewModel.onTerminalInputChange(it) },
                                onExecuteCommand = { viewModel.executeTerminalCommand(it) },
                                onModifierKey = { viewModel.onTerminalModifierKey(it) }
                            )
                        }
                        CloudAppId.PLAY_STORE -> {
                            PlayStoreScreen(
                                uiState = uiState,
                                onSearchChange = { viewModel.onPlayStoreSearchQueryChange(it) },
                                onSelectCategory = { viewModel.onSelectPlayStoreCategory(it) },
                                onToggleInstall = { viewModel.toggleInstallApp(it) },
                                onOpenApp = { viewModel.openApp(it) }
                            )
                        }
                        CloudAppId.YOUTUBE -> {
                            YouTubeCloudScreen(
                                uiState = uiState,
                                onSearchChange = { viewModel.onYoutubeSearchQueryChange(it) },
                                onSelectCategory = { viewModel.onSelectYoutubeCategory(it) },
                                onSelectVideo = { viewModel.selectVideo(it) },
                                onTogglePlayPause = { viewModel.toggleVideoPlayPause() }
                            )
                        }
                        CloudAppId.CLOUD_FILES -> {
                            CloudDriveScreen(
                                uiState = uiState,
                                contents = viewModel.getDirectoryContents(),
                                onNavigateFolder = { viewModel.navigateDriveFolder(it) },
                                onOpenFile = { viewModel.openFileForViewing(it) },
                                onCloseFile = { viewModel.closeFileViewer() },
                                onFileContentChange = { viewModel.onFileContentChange(it) },
                                onSaveFile = { viewModel.saveEditedFile() },
                                onCreateFile = { name, content -> viewModel.createNewCloudFile(name, content) },
                                onCreateFolder = { name -> viewModel.createNewCloudFolder(name) },
                                onDeleteNode = { path -> viewModel.deleteCloudNode(path) }
                            )
                        }
                        CloudAppId.SETTINGS -> {
                            CloudSettingsScreen(
                                uiState = uiState,
                                onBoostRam = { viewModel.boostRam() },
                                onClearCache = { viewModel.clearCloudCache() },
                                onRunSpeedTest = { viewModel.runSpeedTest() }
                            )
                        }
                        CloudAppId.CLOUD_CODE -> {
                            CloudCodeIdeScreen(
                                onRunInTerminal = { code ->
                                    viewModel.openApp(CloudAppId.TERMINAL)
                                    viewModel.executeTerminalCommand(code)
                                }
                            )
                        }
                        CloudAppId.SSH_CLIENT -> {
                            SshClientScreen(
                                onConnectSsh = { sshCmd ->
                                    viewModel.openApp(CloudAppId.TERMINAL)
                                    viewModel.executeTerminalCommand(sshCmd)
                                }
                            )
                        }
                        CloudAppId.SNAKE_GAME -> {
                            RetroSnakeGameScreen(
                                onExit = { viewModel.openApp(CloudAppId.HOME) }
                            )
                        }
                        CloudAppId.TASK_MANAGER -> {
                            TaskManagerScreen(
                                uiState = uiState,
                                onBoostRam = { viewModel.boostRam() }
                            )
                        }
                    }
                }
            }

            // Android Virtual 3-Button Navigation Bar
            CloudNavigationBar(
                onBack = {
                    if (showRecents) showRecents = false
                    else viewModel.navigateBack()
                },
                onHome = {
                    if (showRecents) showRecents = false
                    viewModel.openApp(CloudAppId.HOME)
                },
                onRecents = {
                    showRecents = !showRecents
                }
            )
        }

        // Multitasking App Switcher Modal
        if (showRecents) {
            RecentsAppSwitcher(
                apps = uiState.apps.filter { it.isInstalled },
                onSelectApp = {
                    showRecents = false
                    viewModel.openApp(it)
                },
                onClose = { showRecents = false },
                onClearAll = {
                    showRecents = false
                    viewModel.boostRam()
                    viewModel.openApp(CloudAppId.HOME)
                }
            )
        }
    }
}
