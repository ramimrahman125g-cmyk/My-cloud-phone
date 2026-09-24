package com.example.cloudphone.data

data class CloudPackage(
    val id: String,
    val name: String,
    val version: String,
    val sizeMb: Double,
    val description: String,
    var isInstalled: Boolean = false,
    val category: String = "Utilities"
)

class CloudPackageManager {
    private val packages = mutableMapOf<String, CloudPackage>()

    init {
        registerDefaultPackages()
    }

    private fun registerDefaultPackages() {
        val list = listOf(
            CloudPackage("neofetch", "Neofetch", "7.1.0", 0.8, "CLI system information tool", isInstalled = true, category = "System"),
            CloudPackage("curl", "Curl", "8.5.0", 3.2, "Command line tool for transferring data with URLs", isInstalled = true, category = "Network"),
            CloudPackage("openssh", "OpenSSH", "9.6p1", 8.4, "Secure Shell client for remote server connectivity", isInstalled = true, category = "Network"),
            CloudPackage("python3", "Python 3.12", "3.12.2", 48.5, "Modern interpreted high-level programming language", isInstalled = true, category = "Development"),
            CloudPackage("git", "Git", "2.44.0", 32.1, "Distributed version control system", isInstalled = true, category = "Development"),
            CloudPackage("cmatrix", "CMatrix", "2.0", 1.2, "Matrix digital rain animation in terminal", isInstalled = false, category = "Fun"),
            CloudPackage("htop", "Htop", "3.3.0", 4.1, "Interactive process monitor for 4GB RAM", isInstalled = false, category = "System"),
            CloudPackage("nodejs", "Node.js", "20.11.1", 72.0, "JavaScript runtime built on Chrome's V8 engine", isInstalled = false, category = "Development"),
            CloudPackage("nmap", "Nmap", "7.94", 24.6, "Network exploration tool and security / port scanner", isInstalled = false, category = "Security"),
            CloudPackage("nano", "GNU nano", "7.2", 2.9, "Simple, friendly command line text editor", isInstalled = false, category = "Editor"),
            CloudPackage("vim", "Vim", "9.1.0", 18.2, "Vi IMproved advanced text editor", isInstalled = false, category = "Editor"),
            CloudPackage("tree", "Tree", "2.1.1", 0.5, "Recursive directory listing command", isInstalled = false, category = "Utilities"),
            CloudPackage("clang", "Clang / LLVM", "18.1.0", 125.0, "C and C++ compiler for cloud development", isInstalled = false, category = "Development"),
            CloudPackage("rust", "Rust & Cargo", "1.76.0", 140.0, "Empowering everyone to build reliable and efficient software", isInstalled = false, category = "Development")
        )
        for (pkg in list) {
            packages[pkg.id] = pkg
        }
    }

    fun getAllPackages(): List<CloudPackage> = packages.values.toList()

    fun getPackage(id: String): CloudPackage? = packages[id.lowercase()]

    fun installPackage(id: String): Pair<Boolean, String> {
        val pkg = packages[id.lowercase()]
            ?: return Pair(false, "E: Unable to locate package $id\nTry: 'pkg search' or 'pkg list'")
        if (pkg.isInstalled) {
            return Pair(true, "${pkg.name} is already the newest version (${pkg.version}).")
        }
        pkg.isInstalled = true
        return Pair(true, """
            Reading package lists... Done
            Building dependency tree... Done
            The following NEW packages will be installed:
              ${pkg.id} (${pkg.version})
            Need to get ${pkg.sizeMb} MB of cloud archives.
            Unpacking ${pkg.id} into 64GB Cloud ROM...
            Setting up ${pkg.id} (${pkg.version}) ...
            Cloud VM storage: ${pkg.sizeMb} MB written to Google Cloud. Zero physical phone storage used.
            [SUCCESS] Package ${pkg.name} installed successfully!
        """.trimIndent())
    }

    fun removePackage(id: String): Pair<Boolean, String> {
        val pkg = packages[id.lowercase()]
            ?: return Pair(false, "E: Package $id not found.")
        if (!pkg.isInstalled) {
            return Pair(false, "Package ${pkg.id} is not installed.")
        }
        pkg.isInstalled = false
        return Pair(true, """
            Removing ${pkg.id} (${pkg.version}) ...
            Purging configuration files for ${pkg.id} ...
            Freed ${pkg.sizeMb} MB on 64GB Cloud Storage.
            [SUCCESS] Package ${pkg.name} removed.
        """.trimIndent())
    }

    fun getInstalledPackages(): List<CloudPackage> =
        packages.values.filter { it.isInstalled }

    fun getTotalInstalledSizeMb(): Double =
        packages.values.filter { it.isInstalled }.sumOf { it.sizeMb }
}
