package com.example.cloudphone.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material.icons.filled.VpnKey
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class SshHost(val name: String, val host: String, val port: Int = 22, val user: String)

@Composable
fun SshClientScreen(
    onConnectSsh: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var hosts by remember {
        mutableStateOf(
            listOf(
                SshHost("Google Cloud Ubuntu VM", "34.120.89.1", 22, "cloud"),
                SshHost("Debian Production Server", "198.51.100.42", 22, "root"),
                SshHost("Development Raspberry Pi", "192.168.1.150", 22, "pi")
            )
        )
    }

    var newHostName by remember { mutableStateOf("") }
    var newHostAddress by remember { mutableStateOf("") }
    var newHostUser by remember { mutableStateOf("") }
    var isAdding by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(14.dp)
    ) {
        // Title
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.VpnKey, contentDescription = null, tint = Color(0xFF00B0FF), modifier = Modifier.size(22.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Remote SSH Manager", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = { isAdding = !isAdding },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                modifier = Modifier.height(32.dp)
            ) {
                Text(if (isAdding) "Close" else "+ Add Server", fontSize = 11.sp)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (isAdding) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text("Add Remote Server", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = newHostName,
                        onValueChange = { newHostName = it },
                        placeholder = { Text("Server Name (e.g. AWS VPS)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = newHostAddress,
                        onValueChange = { newHostAddress = it },
                        placeholder = { Text("IP / Hostname (e.g. 192.168.1.1)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = newHostUser,
                        onValueChange = { newHostUser = it },
                        placeholder = { Text("User (e.g. root)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = {
                            if (newHostAddress.isNotBlank()) {
                                hosts = hosts + SshHost(newHostName.ifEmpty { newHostAddress }, newHostAddress, 22, newHostUser.ifEmpty { "root" })
                                newHostName = ""
                                newHostAddress = ""
                                newHostUser = ""
                                isAdding = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                    ) {
                        Text("Save Server")
                    }
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Host List
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(hosts) { host ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(host.name, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text(
                                "${host.user}@${host.host}:${host.port}",
                                color = Color(0xFF38BDF8),
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        Button(
                            onClick = { onConnectSsh("ssh ${host.user}@${host.host}") },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B0FF)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Connect", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
