package com.example.cloudphone.data

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Help
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Games
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material.icons.filled.VpnKey
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

enum class CloudAppId {
    HOME,
    TERMINAL,
    PLAY_STORE,
    YOUTUBE,
    CLOUD_FILES,
    SETTINGS,
    CLOUD_CODE,
    SSH_CLIENT,
    SNAKE_GAME,
    TASK_MANAGER
}

data class CloudAppInfo(
    val id: CloudAppId,
    val packageName: String,
    val name: String,
    val summary: String,
    val icon: ImageVector,
    val iconColor: Color,
    val appSizeMb: Double,
    val ramUsageMb: Int,
    val category: String,
    val rating: Float,
    val downloads: String,
    var isInstalled: Boolean = true,
    val isSystemApp: Boolean = false
)

object CloudAppsRepository {
    fun getInitialApps(): List<CloudAppInfo> {
        return listOf(
            CloudAppInfo(
                id = CloudAppId.TERMINAL,
                packageName = "com.termux.cloud",
                name = "Termux Linux",
                summary = "Full Linux bash terminal, pkg manager, ssh & python",
                icon = Icons.Default.Terminal,
                iconColor = Color(0xFF00E676),
                appSizeMb = 48.0,
                ramUsageMb = 180,
                category = "Development",
                rating = 4.9f,
                downloads = "50M+",
                isInstalled = true,
                isSystemApp = true
            ),
            CloudAppInfo(
                id = CloudAppId.PLAY_STORE,
                packageName = "com.android.vending.cloud",
                name = "Play Store",
                summary = "Virtual Cloud App Store (Uses 64GB Cloud Storage)",
                icon = Icons.Default.ShoppingBag,
                iconColor = Color(0xFF00C853),
                appSizeMb = 65.0,
                ramUsageMb = 240,
                category = "System",
                rating = 4.8f,
                downloads = "1B+",
                isInstalled = true,
                isSystemApp = true
            ),
            CloudAppInfo(
                id = CloudAppId.YOUTUBE,
                packageName = "com.google.android.youtube.cloud",
                name = "YouTube Cloud",
                summary = "Watch videos, tutorials, tech streams & music",
                icon = Icons.Default.PlayArrow,
                iconColor = Color(0xFFFF1744),
                appSizeMb = 85.0,
                ramUsageMb = 380,
                category = "Entertainment",
                rating = 4.7f,
                downloads = "5B+",
                isInstalled = true,
                isSystemApp = false
            ),
            CloudAppInfo(
                id = CloudAppId.CLOUD_FILES,
                packageName = "com.google.android.apps.docs.cloud",
                name = "Cloud Drive",
                summary = "64GB Google Cloud ROM Explorer • 0MB on phone",
                icon = Icons.Default.Folder,
                iconColor = Color(0xFF2979FF),
                appSizeMb = 32.0,
                ramUsageMb = 120,
                category = "Productivity",
                rating = 4.6f,
                downloads = "100M+",
                isInstalled = true,
                isSystemApp = true
            ),
            CloudAppInfo(
                id = CloudAppId.SETTINGS,
                packageName = "com.android.settings.cloud",
                name = "Cloud Specs",
                summary = "4GB RAM & 64GB ROM specs, network & RAM booster",
                icon = Icons.Default.Settings,
                iconColor = Color(0xFF78909C),
                appSizeMb = 18.0,
                ramUsageMb = 90,
                category = "System",
                rating = 4.9f,
                downloads = "Pre-installed",
                isInstalled = true,
                isSystemApp = true
            ),
            CloudAppInfo(
                id = CloudAppId.CLOUD_CODE,
                packageName = "com.clouddroid.ide",
                name = "Cloud Code IDE",
                summary = "Python, Bash & Web script editor with instant run",
                icon = Icons.Default.Code,
                iconColor = Color(0xFFFF9100),
                appSizeMb = 55.0,
                ramUsageMb = 210,
                category = "Development",
                rating = 4.8f,
                downloads = "10M+",
                isInstalled = true,
                isSystemApp = false
            ),
            CloudAppInfo(
                id = CloudAppId.SSH_CLIENT,
                packageName = "com.clouddroid.ssh",
                name = "SSH Connect",
                summary = "Remote server manager & secure shell client",
                icon = Icons.Default.VpnKey,
                iconColor = Color(0xFF00B0FF),
                appSizeMb = 22.0,
                ramUsageMb = 110,
                category = "Network",
                rating = 4.7f,
                downloads = "5M+",
                isInstalled = true,
                isSystemApp = false
            ),
            CloudAppInfo(
                id = CloudAppId.SNAKE_GAME,
                packageName = "com.clouddroid.snake",
                name = "Retro Snake",
                summary = "Classic retro arcade snake in cloud container",
                icon = Icons.Default.Games,
                iconColor = Color(0xFFFFD600),
                appSizeMb = 12.0,
                ramUsageMb = 75,
                category = "Games",
                rating = 4.9f,
                downloads = "2M+",
                isInstalled = true,
                isSystemApp = false
            ),
            CloudAppInfo(
                id = CloudAppId.TASK_MANAGER,
                packageName = "com.clouddroid.taskmanager",
                name = "RAM Monitor",
                summary = "4GB RAM process monitor and cloud task killer",
                icon = Icons.Default.Memory,
                iconColor = Color(0xFFD500F9),
                appSizeMb = 15.0,
                ramUsageMb = 60,
                category = "System",
                rating = 4.9f,
                downloads = "15M+",
                isInstalled = true,
                isSystemApp = true
            )
        )
    }
}
