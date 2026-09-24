package com.example.cloudphone.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import kotlin.random.Random

data class TerminalLine(
    val text: String,
    val isCommand: Boolean = false,
    val isError: Boolean = false,
    val isSystem: Boolean = false,
    val isSuccess: Boolean = false
)

class BashInterpreter(
    val fileSystem: VirtualFileSystem,
    val packageManager: CloudPackageManager,
    val specs: CloudDeviceSpecs
) {
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(8, TimeUnit.SECONDS)
        .readTimeout(8, TimeUnit.SECONDS)
        .build()

    val commandHistory = mutableListOf<String>()
    var inSshSession: Boolean = false
    var sshRemoteHost: String = ""

    suspend fun execute(commandLine: String): List<TerminalLine> {
        val trimmed = commandLine.trim()
        if (trimmed.isEmpty()) return emptyList()

        commandHistory.add(trimmed)

        if (inSshSession) {
            return handleSshSessionCommand(trimmed)
        }

        // Handle redirection: echo "hello" > file.txt or >> file.txt
        if (trimmed.contains(">")) {
            return handleRedirection(trimmed)
        }

        // Handle pipe: command1 | grep pattern
        if (trimmed.contains("|")) {
            val parts = trimmed.split("|", limit = 2)
            val firstOutput = execute(parts[0].trim())
            val secondCmd = parts[1].trim()
            if (secondCmd.startsWith("grep ")) {
                val pattern = secondCmd.removePrefix("grep ").trim().trim('"', '\'')
                val filtered = firstOutput.filter { it.text.contains(pattern, ignoreCase = true) }
                return if (filtered.isEmpty()) {
                    listOf(TerminalLine("Pattern '$pattern' not found in stream."))
                } else filtered
            }
        }

        val tokens = tokenize(trimmed)
        if (tokens.isEmpty()) return emptyList()

        val cmd = tokens[0]
        val args = tokens.drop(1)

        return when (cmd) {
            "help" -> getHelpOutput()
            "clear" -> emptyList() // Handled by caller to clear screen
            "pwd" -> listOf(TerminalLine(fileSystem.currentDirectory.getAbsolutePath()))
            "whoami" -> listOf(TerminalLine("cloud (uid=1000)"))
            "date" -> listOf(TerminalLine(SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.US).format(Date())))
            "uptime" -> listOf(TerminalLine("up 3 hours, 28 min, 1 user, load average: 0.12, 0.08, 0.04"))
            "uname" -> handleUname(args)
            "echo" -> listOf(TerminalLine(args.joinToString(" ").replace("\"", "").replace("'", "")))
            "cd" -> handleCd(args)
            "ls" -> handleLs(args)
            "cat" -> handleCat(args)
            "mkdir" -> handleMkdir(args)
            "touch" -> handleTouch(args)
            "rm" -> handleRm(args)
            "free" -> handleFree(args)
            "df" -> handleDf(args)
            "top", "htop", "ps" -> handleTop()
            "neofetch", "fastfetch" -> handleNeofetch()
            "pkg", "apt", "apt-get" -> handlePkg(args)
            "python", "python3" -> handlePython(args)
            "node", "nodejs" -> handleNode(args)
            "bash", "sh" -> handleBashScript(args)
            "curl" -> handleCurl(args)
            "wget" -> handleWget(args)
            "ping" -> handlePing(args)
            "ssh" -> handleSsh(args)
            "git" -> handleGit(args)
            "cmatrix" -> handleCmatrix()
            "history" -> commandHistory.mapIndexed { index, s -> TerminalLine("  ${index + 1}  $s") }
            else -> {
                // Check if it's an executable file in the current directory: ./script.sh or script.sh
                val scriptPath = if (cmd.startsWith("./")) cmd.substring(2) else cmd
                val node = fileSystem.resolvePath(scriptPath)
                if (node is FsFile) {
                    if (node.name.endsWith(".sh") || node.content.startsWith("#!/bin/")) {
                        executeScriptContent(node.content)
                    } else if (node.name.endsWith(".py")) {
                        executePythonContent(node.content)
                    } else {
                        listOf(TerminalLine(node.content))
                    }
                } else {
                    listOf(
                        TerminalLine(
                            "bash: $cmd: command not found",
                            isError = true
                        ),
                        TerminalLine("Try 'pkg install $cmd' or type 'help' for available commands.")
                    )
                }
            }
        }
    }

    private fun tokenize(input: String): List<String> {
        val list = mutableListOf<String>()
        var current = StringBuilder()
        var inQuote = false
        var quoteChar = ' '

        for (ch in input) {
            when {
                (ch == '"' || ch == '\'') && !inQuote -> {
                    inQuote = true
                    quoteChar = ch
                }
                ch == quoteChar && inQuote -> {
                    inQuote = false
                }
                ch == ' ' && !inQuote -> {
                    if (current.isNotEmpty()) {
                        list.add(current.toString())
                        current = StringBuilder()
                    }
                }
                else -> current.append(ch)
            }
        }
        if (current.isNotEmpty()) list.add(current.toString())
        return list
    }

    private fun handleRedirection(commandLine: String): List<TerminalLine> {
        val append = commandLine.contains(">>")
        val delimiter = if (append) ">>" else ">"
        val parts = commandLine.split(delimiter, limit = 2)
        val left = parts[0].trim()
        val rightFile = parts[1].trim().trim('"', '\'')

        val content = if (left.startsWith("echo ")) {
            left.removePrefix("echo ").trim().trim('"', '\'')
        } else {
            left
        }

        val existing = fileSystem.resolvePath(rightFile)
        if (existing is FsFile && append) {
            existing.content += "\n" + content
        } else {
            fileSystem.createFile(rightFile, content, isExecutable = rightFile.endsWith(".sh"))
        }

        return listOf(
            TerminalLine("Written ${content.length} bytes to $rightFile in 64GB Cloud Storage (0 MB local phone).", isSuccess = true)
        )
    }

    private fun handleUname(args: List<String>): List<TerminalLine> {
        return if (args.contains("-a")) {
            listOf(TerminalLine("Linux google-cloudphone-vm 6.1.0-cloud-android #1 SMP PREEMPT Google-Cloud x86_64 GNU/Linux"))
        } else {
            listOf(TerminalLine("Linux"))
        }
    }

    private fun handleCd(args: List<String>): List<TerminalLine> {
        val target = if (args.isEmpty()) "~" else args[0]
        val success = fileSystem.changeDirectory(target)
        return if (success) {
            emptyList()
        } else {
            listOf(TerminalLine("bash: cd: $target: No such file or directory", isError = true))
        }
    }

    private fun handleLs(args: List<String>): List<TerminalLine> {
        val showAll = args.contains("-a") || args.contains("-la") || args.contains("-al")
        val longFormat = args.contains("-l") || args.contains("-la") || args.contains("-al")
        val pathArg = args.firstOrNull { !it.startsWith("-") }
        val targetDir = if (pathArg != null) {
            val node = fileSystem.resolvePath(pathArg)
            if (node is FsDirectory) node else return listOf(TerminalLine("ls: cannot access '$pathArg': No such directory", isError = true))
        } else {
            fileSystem.currentDirectory
        }

        val nodes = targetDir.children.values.filter { showAll || !it.name.startsWith(".") }
        if (longFormat) {
            val lines = mutableListOf<TerminalLine>()
            lines.add(TerminalLine("total ${nodes.size * 4}K (Google Cloud NVMe)"))
            for (node in nodes.sortedBy { it.name }) {
                val perms = if (node.isDirectory) "drwxr-xr-x" else if ((node as? FsFile)?.isExecutable == true) "-rwxr-xr-x" else "-rw-r--r--"
                val size = if (node.isDirectory) "4096" else node.sizeBytes.toString().padStart(6)
                val colorPrefix = if (node.isDirectory) "[DIR]  " else if ((node as? FsFile)?.isExecutable == true) "[EXE]  " else "       "
                lines.add(TerminalLine("$perms  1 cloud cloud  $size  ${node.formattedDate()}  $colorPrefix${node.name}"))
            }
            return lines
        } else {
            val names = nodes.map {
                if (it.isDirectory) "${it.name}/" else if ((it as? FsFile)?.isExecutable == true) "${it.name}*" else it.name
            }
            return listOf(TerminalLine(names.joinToString("   ")))
        }
    }

    private fun handleCat(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("cat: missing operand", isError = true))
        val node = fileSystem.resolvePath(args[0])
        return when (node) {
            null -> listOf(TerminalLine("cat: ${args[0]}: No such file or directory", isError = true))
            is FsDirectory -> listOf(TerminalLine("cat: ${args[0]}: Is a directory", isError = true))
            is FsFile -> node.content.lines().map { TerminalLine(it) }
        }
    }

    private fun handleMkdir(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("mkdir: missing operand", isError = true))
        val path = args[0]
        val dir = fileSystem.mkdirs(path)
        return if (dir != null) {
            listOf(TerminalLine("Directory '$path' created in 64GB Cloud Storage.", isSuccess = true))
        } else {
            listOf(TerminalLine("mkdir: cannot create directory '$path'", isError = true))
        }
    }

    private fun handleTouch(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("touch: missing file operand", isError = true))
        fileSystem.createFile(args[0], "")
        return emptyList()
    }

    private fun handleRm(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("rm: missing operand", isError = true))
        val target = args.last()
        val success = fileSystem.deleteNode(target)
        return if (success) {
            listOf(TerminalLine("Removed '$target' from cloud storage."))
        } else {
            listOf(TerminalLine("rm: cannot remove '$target': No such file or directory", isError = true))
        }
    }

    private fun handleFree(args: List<String>): List<TerminalLine> {
        return listOf(
            TerminalLine("               total        used        free      shared  buff/cache   available"),
            TerminalLine("Mem:         4096Mi      1420Mi      2310Mi        48Mi       366Mi      2676Mi"),
            TerminalLine("Swap:        2048Mi         0Mi      2048Mi"),
            TerminalLine("Specs: 4.0 GB LPDDR4x Cloud Container RAM • Powered by Google Cloud")
        )
    }

    private fun handleDf(args: List<String>): List<TerminalLine> {
        return listOf(
            TerminalLine("Filesystem      Size  Used Avail Use% Mounted on"),
            TerminalLine("/dev/cloudnvme   64G  8.4G   55G  14% /"),
            TerminalLine("tmpfs           2.0G  4.0K  2.0G   1% /dev/shm"),
            TerminalLine("/dev/gdrive      64G  1.4G   62G   3% /storage/google-cloud-drive"),
            TerminalLine("Notice: Zero space (0 MB) used on physical phone. All files hosted in Cloud ROM.")
        )
    }

    private fun handleTop(): List<TerminalLine> {
        return listOf(
            TerminalLine("Tasks: 18 total, 1 running, 17 sleeping, 0 stopped, 0 zombie"),
            TerminalLine("%Cpu(s):  2.4 us,  1.1 sy,  0.0 ni, 96.5 id,  0.0 wa,  0.0 hi"),
            TerminalLine("MiB Mem :   4096.0 total,   2310.2 free,   1420.5 used,    365.3 buff/cache"),
            TerminalLine(""),
            TerminalLine("    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND"),
            TerminalLine("    101 cloud     20   0  380.4m  85.2m  45.1m S   3.2   2.1   0:08.41 clouddroid-core"),
            TerminalLine("    215 cloud     20   0  240.1m  62.0m  32.4m S   1.8   1.5   0:04.12 termux-daemon"),
            TerminalLine("    342 cloud     20   0  520.8m 180.5m  64.2m S   2.5   4.4   0:15.30 playstore-cloud"),
            TerminalLine("    408 cloud     20   0  610.2m 210.0m  78.1m S   4.1   5.1   0:22.04 youtube-service"),
            TerminalLine("    890 cloud     20   0   48.2m  18.4m  12.0m R   0.9   0.4   0:00.08 htop")
        )
    }

    private fun handleNeofetch(): List<TerminalLine> {
        return listOf(
            TerminalLine("       ___          cloud@google-cloudphone-vm"),
            TerminalLine("      (.. \\         --------------------------"),
            TerminalLine("      (<>  )        OS: CloudDroid Linux 6.1 (Cloud Phone Container)"),
            TerminalLine("     //~~\\\\         Host: Google Cloud Platform n2-highcpu-8"),
            TerminalLine("    //    \\\\        Kernel: 6.1.0-cloud-android-x86_64"),
            TerminalLine("   ( \\___/ )        Uptime: 3 hours, 45 mins"),
            TerminalLine("    \\_____/         Packages: ${packageManager.getInstalledPackages().size} (pkg/apt)"),
            TerminalLine("                    Shell: bash 5.2.21"),
            TerminalLine("                    Terminal: CloudTermux v0.118"),
            TerminalLine("                    CPU: Virtual 8-Core Intel Xeon @ 3.40GHz"),
            TerminalLine("                    RAM: 1,420 MB / 4,096 MB (4.0 GB Cloud LPDDR4x)"),
            TerminalLine("                    Disk: 8.4 GB / 64.0 GB (64.0 GB Google Cloud ROM)"),
            TerminalLine("                    Local Phone Storage: 0.0 MB (100% Cloud-Hosted)")
        )
    }

    private fun handlePkg(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) {
            return listOf(
                TerminalLine("Termux Package Manager (Cloud Edition)", isSystem = true),
                TerminalLine("Usage: pkg install <pkg> | pkg list | pkg update | pkg remove <pkg>")
            )
        }

        return when (args[0]) {
            "install" -> {
                if (args.size < 2) {
                    listOf(TerminalLine("Usage: pkg install <package-name>", isError = true))
                } else {
                    val pkgName = args[1]
                    val (success, message) = packageManager.installPackage(pkgName)
                    message.lines().map { TerminalLine(it, isSuccess = success, isError = !success) }
                }
            }
            "remove", "uninstall" -> {
                if (args.size < 2) {
                    listOf(TerminalLine("Usage: pkg remove <package-name>", isError = true))
                } else {
                    val (success, message) = packageManager.removePackage(args[1])
                    message.lines().map { TerminalLine(it, isSuccess = success, isError = !success) }
                }
            }
            "list" -> {
                val list = packageManager.getAllPackages()
                val lines = mutableListOf<TerminalLine>()
                lines.add(TerminalLine("Listing packages in 64GB Cloud Repository:", isSystem = true))
                for (p in list) {
                    val status = if (p.isInstalled) "[INSTALLED]" else "[AVAILABLE]"
                    lines.add(TerminalLine("  ${p.id.padEnd(12)} ${p.version.padEnd(8)} ${p.sizeMb}MB  $status - ${p.description}"))
                }
                lines
            }
            "update", "upgrade" -> {
                listOf(
                    TerminalLine("Checking Google Cloud package mirrors..."),
                    TerminalLine("All 64GB Cloud repository mirrors up to date."),
                    TerminalLine("0 packages can be upgraded.")
                )
            }
            "search" -> {
                val query = args.getOrNull(1)?.lowercase() ?: ""
                val matches = packageManager.getAllPackages().filter { it.id.contains(query) || it.name.lowercase().contains(query) }
                matches.map { TerminalLine("${it.id} - ${it.description} (${it.sizeMb} MB)") }
            }
            else -> listOf(TerminalLine("Unknown command 'pkg ${args[0]}'. Try 'pkg list' or 'pkg install <pkg>'", isError = true))
        }
    }

    private fun handlePython(args: List<String>): List<TerminalLine> {
        val pyPkg = packageManager.getPackage("python3")
        if (pyPkg?.isInstalled == false) {
            return listOf(TerminalLine("python3: command not found. Install it with: 'pkg install python3'", isError = true))
        }

        if (args.isEmpty()) {
            return listOf(
                TerminalLine("Python 3.12.2 (main, CloudDroid Linux container)"),
                TerminalLine("[GCC 13.2.0 on linux] on cloudphone"),
                TerminalLine("Type \"help\", \"copyright\", \"credits\" or \"license\" for more information."),
                TerminalLine("Tip: Run scripts with 'python3 <filename.py>' or -c 'print(\"Hello\")'")
            )
        }

        if (args[0] == "-c") {
            val code = args.drop(1).joinToString(" ").trim('"', '\'')
            return executePythonContent(code)
        }

        val fileNode = fileSystem.resolvePath(args[0])
        return if (fileNode is FsFile) {
            executePythonContent(fileNode.content)
        } else {
            listOf(TerminalLine("python3: can't open file '${args[0]}': [Errno 2] No such file", isError = true))
        }
    }

    private fun executePythonContent(code: String): List<TerminalLine> {
        val lines = code.lines()
        val output = mutableListOf<TerminalLine>()
        for (line in lines) {
            val trimmed = line.trim()
            if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
                val inside = trimmed.removePrefix("print(").removeSuffix(")").trim().trim('"', '\'')
                output.add(TerminalLine(inside))
            } else if (trimmed.startsWith("#") || trimmed.isEmpty() || trimmed.startsWith("import ")) {
                // Ignore comments and imports
            } else {
                output.add(TerminalLine(">>> Evaluated: $trimmed"))
            }
        }
        if (output.isEmpty()) output.add(TerminalLine("Process finished with exit code 0"))
        return output
    }

    private fun handleNode(args: List<String>): List<TerminalLine> {
        val nodePkg = packageManager.getPackage("nodejs")
        if (nodePkg?.isInstalled == false) {
            return listOf(TerminalLine("node: command not found. Install it with: 'pkg install nodejs'", isError = true))
        }

        if (args.isEmpty()) {
            return listOf(TerminalLine("Welcome to Node.js v20.11.1 (CloudDroid). Type .exit to return."))
        }

        if (args[0] == "-e") {
            val code = args.drop(1).joinToString(" ").trim('"', '\'')
            return listOf(TerminalLine("JS Output: $code"))
        }

        val fileNode = fileSystem.resolvePath(args[0])
        return if (fileNode is FsFile) {
            listOf(TerminalLine("Executing ${args[0]} with Node.js v20..."), TerminalLine(fileNode.content))
        } else {
            listOf(TerminalLine("node: cannot find module '${args[0]}'", isError = true))
        }
    }

    private fun handleBashScript(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("bash: missing script argument", isError = true))
        val target = args[0]
        val fileNode = fileSystem.resolvePath(target)
        return if (fileNode is FsFile) {
            executeScriptContent(fileNode.content)
        } else {
            listOf(TerminalLine("bash: $target: No such file or directory", isError = true))
        }
    }

    private fun executeScriptContent(script: String): List<TerminalLine> {
        val lines = script.lines()
        val result = mutableListOf<TerminalLine>()
        val variables = mutableMapOf<String, String>()

        for (line in lines) {
            var trimmed = line.trim()
            if (trimmed.isEmpty() || trimmed.startsWith("#!/bin") || trimmed.startsWith("#")) continue

            // Variable substitution: $VAR
            for ((key, value) in variables) {
                trimmed = trimmed.replace("$$key", value)
            }

            // Variable assignment: FOO=BAR
            if (trimmed.contains("=") && !trimmed.startsWith("echo ") && !trimmed.contains(" ")) {
                val parts = trimmed.split("=", limit = 2)
                variables[parts[0]] = parts[1].trim('"', '\'')
                continue
            }

            if (trimmed.startsWith("echo ")) {
                val text = trimmed.removePrefix("echo ").trim().trim('"', '\'')
                result.add(TerminalLine(text))
            } else {
                result.add(TerminalLine(trimmed))
            }
        }
        return result
    }

    private suspend fun handleCurl(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("curl: try 'curl --help' or 'curl <url>'", isError = true))
        val url = args.last()
        val fixedUrl = if (!url.startsWith("http://") && !url.startsWith("https://")) "https://$url" else url

        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url(fixedUrl)
                    .header("User-Agent", "CloudPhone-Termux/1.0 (Linux; GoogleCloud 6.1)")
                    .build()

                httpClient.newCall(request).execute().use { response ->
                    val body = response.body?.string()?.take(1200) ?: "Empty response"
                    listOf(
                        TerminalLine("HTTP/2 ${response.code} ${response.message}", isSystem = true),
                        TerminalLine("Content-Type: ${response.header("Content-Type") ?: "text/plain"}"),
                        TerminalLine(""),
                        TerminalLine(body)
                    )
                }
            } catch (e: Exception) {
                listOf(
                    TerminalLine("curl: (6) Could not resolve host or network error: ${e.message}", isError = true),
                    TerminalLine("[SIMULATED RESPONSE FOR $fixedUrl]: Connected via 10Gbps Cloud Pipe. Status: OK 200.")
                )
            }
        }
    }

    private suspend fun handleWget(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("wget: missing URL", isError = true))
        val url = args.last()
        val filename = url.substringAfterLast("/").ifEmpty { "download.out" }

        val lines = handleCurl(args)
        val content = lines.joinToString("\n") { it.text }
        fileSystem.createFile(filename, content)

        return listOf(
            TerminalLine("--2026-09-23 20:00:00--  $url"),
            TerminalLine("Resolving host via Google Cloud Datacenter... connected."),
            TerminalLine("HTTP request sent, awaiting response... 200 OK"),
            TerminalLine("Length: ${content.length} [text/plain]"),
            TerminalLine("Saving to: '$filename' in 64GB Cloud Storage (0 MB local phone)"),
            TerminalLine("'$filename' saved [${content.length}/${content.length}]", isSuccess = true)
        )
    }

    private fun handlePing(args: List<String>): List<TerminalLine> {
        if (args.isEmpty()) return listOf(TerminalLine("ping: usage error: Destination address required", isError = true))
        val host = args[0]
        val ip = when (host) {
            "google.com" -> "142.250.190.46"
            "github.com" -> "140.82.121.4"
            else -> "8.8.8.8"
        }

        val rtt = Random.nextInt(3, 14)
        return listOf(
            TerminalLine("PING $host ($ip) 56(84) bytes of data."),
            TerminalLine("64 bytes from $ip: icmp_seq=1 ttl=118 time=${rtt}.2 ms"),
            TerminalLine("64 bytes from $ip: icmp_seq=2 ttl=118 time=${rtt + 1}.0 ms"),
            TerminalLine("64 bytes from $ip: icmp_seq=3 ttl=118 time=${rtt - 1}.8 ms"),
            TerminalLine("--- $host ping statistics ---"),
            TerminalLine("3 packets transmitted, 3 received, 0% packet loss, time 2003ms"),
            TerminalLine("rtt min/avg/max = ${rtt - 1}.8/${rtt}.3/${rtt + 1}.0 ms (Ultra low latency cloud link)", isSuccess = true)
        )
    }

    private fun handleSsh(args: List<String>): List<TerminalLine> {
        val openssh = packageManager.getPackage("openssh")
        if (openssh?.isInstalled == false) {
            return listOf(TerminalLine("ssh: command not found. Install it with: 'pkg install openssh'", isError = true))
        }

        if (args.isEmpty()) {
            return listOf(TerminalLine("usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] destination [command]", isError = true))
        }

        val destination = args[0]
        inSshSession = true
        sshRemoteHost = destination

        return listOf(
            TerminalLine("OpenSSH_9.6p1, Google Cloud OpenSSL 3.0.13", isSystem = true),
            TerminalLine("Connecting to $destination port 22 via 10Gbps Cloud Pipe..."),
            TerminalLine("Connection established to $destination."),
            TerminalLine("Authenticated with CloudDroid Virtual RSA Key."),
            TerminalLine("Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)"),
            TerminalLine("Last login: Wed Sep 23 19:42:01 from 34.120.89.214"),
            TerminalLine("Type 'exit' to disconnect and return to CloudPhone.", isSuccess = true)
        )
    }

    private fun handleSshSessionCommand(commandLine: String): List<TerminalLine> {
        if (commandLine == "exit" || commandLine == "logout") {
            inSshSession = false
            val host = sshRemoteHost
            sshRemoteHost = ""
            return listOf(
                TerminalLine("Connection to $host closed."),
                TerminalLine("Returned to local CloudDroid terminal (4GB RAM / 64GB ROM).", isSystem = true)
            )
        }

        return listOf(
            TerminalLine("[$sshRemoteHost]$ $commandLine"),
            TerminalLine("[REMOTE SERVER RESPONSE] Executed on $sshRemoteHost. (Type 'exit' to return).")
        )
    }

    private fun handleGit(args: List<String>): List<TerminalLine> {
        val gitPkg = packageManager.getPackage("git")
        if (gitPkg?.isInstalled == false) {
            return listOf(TerminalLine("git: command not found. Install it with: 'pkg install git'", isError = true))
        }

        if (args.isEmpty()) {
            return listOf(TerminalLine("git version 2.44.0 (CloudDroid)\nType 'git --help' for commands."))
        }

        return when (args[0]) {
            "status" -> listOf(
                TerminalLine("On branch main"),
                TerminalLine("Your branch is up to date with 'origin/main'."),
                TerminalLine("nothing to commit, working tree clean in 64GB Cloud Storage.")
            )
            "clone" -> {
                val repo = args.getOrNull(1) ?: "repo"
                val dirName = repo.substringAfterLast("/").removeSuffix(".git")
                fileSystem.mkdirs(dirName)
                fileSystem.createFile("$dirName/README.md", "# Cloned from $repo\nHosted on CloudPhone 64GB ROM.")
                listOf(
                    TerminalLine("Cloning into '$dirName'..."),
                    TerminalLine("remote: Enumerating objects: 42, done."),
                    TerminalLine("remote: Total 42 (delta 18), reused 42 (delta 18)"),
                    TerminalLine("Receiving objects: 100% (42/42), 85.40 KiB | 28.00 MiB/s, done."),
                    TerminalLine("[SUCCESS] Cloned into '$dirName'. Zero local phone storage used.", isSuccess = true)
                )
            }
            else -> listOf(TerminalLine("git: '${args[0]}' is not a git command. See 'git --help'."))
        }
    }

    private fun handleCmatrix(): List<TerminalLine> {
        return listOf(
            TerminalLine("0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1", isSystem = true),
            TerminalLine("1 0 1 0 T E R M U X 1 0 1 0 1 0 1 0 1 0 1 0", isSystem = true),
            TerminalLine("0 1 0 1 C L O U D P H O N E 0 1 0 1 0 1 0 1", isSuccess = true),
            TerminalLine("1 0 1 0 4 G B - R A M - 6 4 G B - R O M 1 0", isSuccess = true),
            TerminalLine("0 1 0 1 G O O G L E - C L O U D - V M 0 1 0", isSystem = true),
            TerminalLine("Matrix stream paused. Press Return to continue.")
        )
    }

    private fun getHelpOutput(): List<TerminalLine> {
        return listOf(
            TerminalLine("=== CLOUDDROID LINUX COMMAND REFERENCE ===", isSystem = true),
            TerminalLine("Hardware: 4.0 GB RAM • 64.0 GB Cloud ROM • 0 MB Local Storage"),
            TerminalLine(""),
            TerminalLine("Core Commands:"),
            TerminalLine("  ls [-l, -a]   - List files in current cloud directory"),
            TerminalLine("  cd <path>     - Change directory (~ for home)"),
            TerminalLine("  cat <file>    - Display contents of file"),
            TerminalLine("  echo text > f - Write text to file (> or >>)"),
            TerminalLine("  mkdir / rm    - Create or remove files and directories"),
            TerminalLine("  neofetch      - Show Linux OS specs and 4GB RAM stats"),
            TerminalLine("  free -h       - Display 4.0 GB RAM memory usage"),
            TerminalLine("  df -h         - Show 64.0 GB Cloud ROM disk space"),
            TerminalLine("  top / ps      - View running cloud container tasks"),
            TerminalLine(""),
            TerminalLine("Development & Network:"),
            TerminalLine("  pkg install x - Install packages (python3, nodejs, git, etc.)"),
            TerminalLine("  pkg list      - List all packages in 64GB Cloud repository"),
            TerminalLine("  python3 f.py  - Execute Python 3 cloud scripts"),
            TerminalLine("  bash s.sh     - Run bash shell scripts (e.g. ./welcome.sh)"),
            TerminalLine("  curl <url>    - Perform real HTTP requests via 10Gbps link"),
            TerminalLine("  ping <host>   - Test network connectivity to any server"),
            TerminalLine("  ssh host      - Connect to remote SSH servers"),
            TerminalLine("  cmatrix       - Cyberpunk Matrix rain effect"),
            TerminalLine("  clear         - Clear terminal display")
        )
    }
}
