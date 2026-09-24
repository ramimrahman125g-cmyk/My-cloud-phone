package com.example.cloudphone.data

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

sealed class FsNode(
    val name: String,
    var parent: FsDirectory?,
    var modifiedTime: Long = System.currentTimeMillis()
) {
    abstract val isDirectory: Boolean
    abstract val sizeBytes: Long

    fun getAbsolutePath(): String {
        if (parent == null) return if (name.isEmpty() || name == "/") "/" else "/$name"
        val parentPath = parent?.getAbsolutePath() ?: ""
        return if (parentPath == "/") "/$name" else "$parentPath/$name"
    }

    fun formattedDate(): String {
        val sdf = SimpleDateFormat("MMM dd HH:mm", Locale.US)
        return sdf.format(Date(modifiedTime))
    }
}

class FsFile(
    name: String,
    parent: FsDirectory?,
    var content: String = "",
    var isExecutable: Boolean = false
) : FsNode(name, parent) {
    override val isDirectory: Boolean = false
    override val sizeBytes: Long
        get() = content.toByteArray().size.toLong()
}

class FsDirectory(
    name: String,
    parent: FsDirectory?
) : FsNode(name, parent) {
    override val isDirectory: Boolean = true
    val children = mutableMapOf<String, FsNode>()

    override val sizeBytes: Long
        get() = children.values.sumOf { it.sizeBytes } + 4096L
}

class VirtualFileSystem {
    val root: FsDirectory = FsDirectory("/", null)
    var currentDirectory: FsDirectory = root

    init {
        initDefaultFileSystem()
    }

    private fun initDefaultFileSystem() {
        val bin = mkdirs("/bin")
        val etc = mkdirs("/etc")
        val usr = mkdirs("/usr/bin")
        val home = mkdirs("/home/cloud")
        val gdrive = mkdirs("/storage/google-cloud-drive")
        val tmp = mkdirs("/tmp")

        // Pre-populate /etc
        createFile(
            "/etc/os-release",
            """
            NAME="CloudDroid Linux"
            VERSION="6.1.0-cloud-android (Google Cloud Container)"
            ID=clouddroid
            ID_LIKE=debian
            PRETTY_NAME="CloudDroid Linux 6.1 (4GB RAM / 64GB Cloud ROM)"
            HOME_URL="https://cloud.google.com/"
            """.trimIndent()
        )

        createFile(
            "/etc/hosts",
            """
            127.0.0.1   localhost
            34.120.89.214  clouddroid-pro-vm
            8.8.8.8     dns.google
            """.trimIndent()
        )

        createFile(
            "/etc/resolv.conf",
            """
            nameserver 8.8.8.8
            nameserver 8.8.4.4
            """.trimIndent()
        )

        // Pre-populate /storage/google-cloud-drive
        createFile(
            "/storage/google-cloud-drive/CLOUD_STORAGE_INFO.txt",
            """
            ====================================================
            GOOGLE CLOUD STORAGE VIRTUAL MOUNT
            ====================================================
            Total Quota: 64.0 GB NVMe Cloud Disk
            Physical Device Impact: 0.0 MB (Zero local device storage used)
            Sync Status: Connected to Google Cloud Platform Datacenter
            Latency: 4ms • 10 Gbps Cloud Link
            
            All packages, bash scripts, videos, and Play Store apps
            run entirely in your remote cloud environment!
            ====================================================
            """.trimIndent()
        )

        // Pre-populate sample scripts in /home/cloud
        createFile(
            "/home/cloud/welcome.sh",
            """
            #!/bin/bash
            echo "=================================================="
            echo "🚀 WELCOME TO CLOUDDROID TERMINAL & LINUX OS 🚀"
            echo "=================================================="
            echo "Specs: 4.0 GB RAM | 64.0 GB Cloud ROM (Google Cloud)"
            echo "Status: Zero device storage used! 100% Cloud-Powered."
            echo ""
            echo "Quick commands:"
            echo "  neofetch       - Display cloud phone specs & system info"
            echo "  pkg install    - Install packages (python, node, git, etc.)"
            echo "  curl <url>     - Query real internet APIs / websites"
            echo "  ssh <host>     - Connect to remote servers"
            echo "  free -h / df -h- Check RAM and 64GB Cloud Storage"
            echo "  ./sys_bench.sh - Run 4GB RAM cloud benchmark"
            echo "=================================================="
            """.trimIndent(),
            isExecutable = true
        )

        createFile(
            "/home/cloud/sys_bench.sh",
            """
            #!/bin/bash
            echo "[*] Initializing CloudDroid 4GB RAM & 64GB ROM Benchmark..."
            echo "[+] Allocating 1024MB Cloud Virtual Buffer..."
            echo "[+] Testing Google Cloud NVMe I/O Speed..."
            echo "[+] Read: 2450 MB/s | Write: 1890 MB/s (100% Cloud-Backed)"
            echo "[+] CPU: 8-Core Virtual Xeon @ 3.4GHz"
            echo "[+] Benchmark Score: 9840 pts (OPTIMAL PERFORMANCE)"
            """.trimIndent(),
            isExecutable = true
        )

        createFile(
            "/home/cloud/matrix.sh",
            """
            #!/bin/bash
            echo "Connecting to CloudDroid Matrix Stream..."
            echo "01010100 01100101 01110010 01101101 01110101 01111000"
            echo "01000011 01101100 01101111 01110101 01100100 01010000"
            echo "System secure: 4GB RAM Allocated. Google Cloud Connected."
            """.trimIndent(),
            isExecutable = true
        )

        createFile(
            "/home/cloud/cloud_test.py",
            """
            # Python Cloud Script
            import sys
            print("Python 3.12 Cloud Runtime")
            print("Cloud Memory: 4096 MB LPDDR4x")
            print("Cloud ROM: 64 GB NVMe")
            print("Status: Cloud VM operational on Google Cloud!")
            """.trimIndent(),
            isExecutable = true
        )

        // Set initial working directory to /home/cloud
        currentDirectory = home ?: root
    }

    fun resolvePath(path: String): FsNode? {
        if (path.isEmpty()) return currentDirectory
        val trimmed = path.trim()
        val parts = if (trimmed.startsWith("/")) {
            trimmed.split("/").filter { it.isNotEmpty() }
        } else {
            val currParts = currentDirectory.getAbsolutePath().split("/").filter { it.isNotEmpty() }
            val relativeParts = trimmed.split("/").filter { it.isNotEmpty() }
            currParts + relativeParts
        }

        val stack = mutableListOf<String>()
        for (part in parts) {
            when (part) {
                "." -> {}
                ".." -> if (stack.isNotEmpty()) stack.removeAt(stack.size - 1)
                "~" -> {
                    stack.clear()
                    stack.add("home")
                    stack.add("cloud")
                }
                else -> stack.add(part)
            }
        }

        var curr: FsNode = root
        for (name in stack) {
            if (curr !is FsDirectory) return null
            val next = curr.children[name] ?: return null
            curr = next
        }
        return curr
    }

    fun mkdirs(path: String): FsDirectory? {
        val parts = path.split("/").filter { it.isNotEmpty() }
        var curr = root
        for (part in parts) {
            val existing = curr.children[part]
            if (existing == null) {
                val newDir = FsDirectory(part, curr)
                curr.children[part] = newDir
                curr = newDir
            } else if (existing is FsDirectory) {
                curr = existing
            } else {
                return null // Cannot create dir over a file
            }
        }
        return curr
    }

    fun createFile(path: String, content: String = "", isExecutable: Boolean = false): FsFile? {
        val parts = path.split("/").filter { it.isNotEmpty() }
        if (parts.isEmpty()) return null
        val fileName = parts.last()
        val parentPath = if (parts.size == 1) {
            if (path.startsWith("/")) "/" else currentDirectory.getAbsolutePath()
        } else {
            val prefix = if (path.startsWith("/")) "/" else ""
            prefix + parts.dropLast(1).joinToString("/")
        }

        val parentDirNode = resolvePath(parentPath) ?: mkdirs(parentPath)
        if (parentDirNode !is FsDirectory) return null

        val existing = parentDirNode.children[fileName]
        if (existing is FsFile) {
            existing.content = content
            existing.modifiedTime = System.currentTimeMillis()
            existing.isExecutable = isExecutable
            return existing
        } else if (existing is FsDirectory) {
            return null
        }

        val newFile = FsFile(fileName, parentDirNode, content, isExecutable)
        parentDirNode.children[fileName] = newFile
        return newFile
    }

    fun deleteNode(path: String): Boolean {
        val target = resolvePath(path) ?: return false
        val parent = target.parent ?: return false
        parent.children.remove(target.name)
        return true
    }

    fun changeDirectory(path: String): Boolean {
        val target = if (path.isEmpty() || path == "~") {
            resolvePath("/home/cloud")
        } else {
            resolvePath(path)
        }
        if (target is FsDirectory) {
            currentDirectory = target
            return true
        }
        return false
    }

    fun getAllFilesRecursive(dir: FsDirectory = root): List<FsNode> {
        val list = mutableListOf<FsNode>()
        for (child in dir.children.values) {
            list.add(child)
            if (child is FsDirectory) {
                list.addAll(getAllFilesRecursive(child))
            }
        }
        return list
    }
}
