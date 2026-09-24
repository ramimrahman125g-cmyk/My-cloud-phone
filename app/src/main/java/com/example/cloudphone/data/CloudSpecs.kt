package com.example.cloudphone.data

data class CloudDeviceSpecs(
    val modelName: String = "CloudDroid Virtual Pro (GCP Cloud Edition)",
    val osName: String = "Android 15 (Cloud Linux Container 6.1-android)",
    val totalRamMb: Long = 4096L, // 4.0 GB RAM
    val totalRomGb: Double = 64.0, // 64.0 GB Cloud ROM
    val cloudProvider: String = "Google Cloud Platform (GCP Container)",
    val cloudRegion: String = "asia-east1 / us-central1 (Low Latency Edge)",
    val cloudIp: String = "34.120.89.214",
    val localDeviceUsageMb: Double = 0.0, // Zero space taken on physical phone!
    val networkBandwidth: String = "10 Gbps Cloud Datacenter Pipe"
)

data class StorageBreakdown(
    val totalGb: Double = 64.0,
    val systemOsGb: Double = 5.2,
    val installedAppsGb: Double = 3.6,
    val userFilesGb: Double = 1.4,
    val cloudCacheGb: Double = 0.8
) {
    val usedGb: Double
        get() = systemOsGb + installedAppsGb + userFilesGb + cloudCacheGb

    val freeGb: Double
        get() = (totalGb - usedGb).coerceAtLeast(0.1)

    val usedPercent: Float
        get() = ((usedGb / totalGb) * 100).toFloat().coerceIn(0f, 100f)
}
