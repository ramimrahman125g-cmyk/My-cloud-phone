package com.example.cloudphone.data

data class YouTubeVideo(
    val id: String,
    val title: String,
    val channel: String,
    val views: String,
    val timeAgo: String,
    val duration: String,
    val category: String,
    val description: String,
    val likes: String,
    val comments: List<VideoComment>
)

data class VideoComment(
    val author: String,
    val text: String,
    val time: String,
    val likes: String
)

object YouTubeRepository {
    fun getVideos(): List<YouTubeVideo> {
        return listOf(
            YouTubeVideo(
                id = "termux_101",
                title = "Termux Complete Linux Guide on Android Cloud: Bash & Pkg",
                channel = "Linux Cloud Master",
                views = "842K views",
                timeAgo = "2 weeks ago",
                duration = "18:42",
                category = "Linux & Termux",
                description = "Learn how to master Termux in a 4GB RAM Cloud Phone environment with 64GB storage! We cover package management, bash scripting, SSH servers, and running Python.",
                likes = "54K",
                comments = listOf(
                    VideoComment("DevNinja", "Cloud phone terminal is crazy fast, zero lag on bash scripts!", "1 day ago", "1.2K"),
                    VideoComment("Sarah Connor", "Finally an environment with 64GB cloud storage that doesn't consume my phone memory!", "3 days ago", "890"),
                    VideoComment("CodeCrafter", "neofetch and curl work like a charm.", "5 days ago", "412")
                )
            ),
            YouTubeVideo(
                id = "cloud_phone_review",
                title = "Cloud Phone vs Physical Phone: 64GB ROM & 4GB RAM Tested!",
                channel = "Tech Cloud Daily",
                views = "1.4M views",
                timeAgo = "1 month ago",
                duration = "14:15",
                category = "Tech Reviews",
                description = "Can a virtual cloud phone replace local storage? We test Google Cloud container hosting, 64GB NVMe ROM, and 4GB LPDDR4x RAM performance.",
                likes = "98K",
                comments = listOf(
                    VideoComment("Alex G", "Zero storage taken on my actual phone is the best part.", "2 weeks ago", "3.4K"),
                    VideoComment("CloudArchitect", "The 10Gbps cloud datacenter pipe makes downloads instant.", "3 weeks ago", "1.1K")
                )
            ),
            YouTubeVideo(
                id = "python_cloud_lab",
                title = "Build & Run Python 3 Scripts on Cloud Linux Terminal",
                channel = "Python Hacker",
                views = "520K views",
                timeAgo = "3 weeks ago",
                duration = "22:10",
                category = "Python & Coding",
                description = "Full tutorial writing Python scripts, HTTP clients, and background tasks inside the CloudDroid terminal with real-time terminal output.",
                likes = "38K",
                comments = listOf(
                    VideoComment("PyDev99", "Loving the virtual file system and instant execution.", "4 days ago", "210"),
                    VideoComment("Markus", "Tested pkg install python3 and it runs perfectly.", "1 week ago", "145")
                )
            ),
            YouTubeVideo(
                id = "ssh_remote_guide",
                title = "SSH Remote Server Connection & Server Management on Android",
                channel = "SysAdmin Pro",
                views = "310K views",
                timeAgo = "4 days ago",
                duration = "12:05",
                category = "Linux & Termux",
                description = "How to connect from your Android Cloud Terminal to remote Linux VPS servers using SSH keys, port forwarding, and tmux.",
                likes = "26K",
                comments = listOf(
                    VideoComment("CloudAdmin", "Saved my life during server maintenance on the go.", "2 days ago", "430"),
                    VideoComment("TerminalFan", "The shortcut bar with ESC and TAB is so handy.", "3 days ago", "190")
                )
            ),
            YouTubeVideo(
                id = "lofi_cyberpunk",
                title = "Lo-Fi Beats to Code / Termux Hacking Chill Mix [24/7]",
                channel = "Chill Cloud Radio",
                views = "3.8M views",
                timeAgo = "Live",
                duration = "LIVE",
                category = "Music / Lo-Fi",
                description = "Relaxing synthwave and lo-fi hip hop beats to code, hack, and study with in your CloudDroid terminal.",
                likes = "240K",
                comments = listOf(
                    VideoComment("NightCoder", "Coding bash scripts with this in the background is elite.", "1 hour ago", "56"),
                    VideoComment("Neo", "Entering the Matrix...", "3 hours ago", "120")
                )
            ),
            YouTubeVideo(
                id = "gcp_architecture",
                title = "How Google Cloud Hosts Virtual Android Containers & 64GB ROM",
                channel = "Google Cloud Tech",
                views = "920K views",
                timeAgo = "1 month ago",
                duration = "19:50",
                category = "Cloud Phone & GCP",
                description = "Deep dive into microVM sandboxing, NVMe cloud storage block devices, memory overcommit, and zero local footprint architecture.",
                likes = "72K",
                comments = listOf(
                    VideoComment("EngineerBob", "High availability and distributed storage explained clearly.", "10 days ago", "670")
                )
            )
        )
    }
}
