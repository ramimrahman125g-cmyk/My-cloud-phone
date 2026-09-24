package com.example.cloudphone.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowLeft
import androidx.compose.material.icons.filled.ArrowRight
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.Games
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlin.random.Random

data class SnakePoint(val x: Int, val y: Int)

enum class Direction { UP, DOWN, LEFT, RIGHT }

@Composable
fun RetroSnakeGameScreen(
    onExit: () -> Unit,
    modifier: Modifier = Modifier
) {
    val gridSize = 18
    var snake by remember { mutableStateOf(listOf(SnakePoint(5, 5), SnakePoint(4, 5), SnakePoint(3, 5))) }
    var food by remember { mutableStateOf(SnakePoint(10, 10)) }
    var direction by remember { mutableStateOf(Direction.RIGHT) }
    var isGameOver by remember { mutableStateOf(false) }
    var score by remember { mutableStateOf(0) }
    var isPaused by remember { mutableStateOf(false) }

    fun spawnFood(): SnakePoint {
        while (true) {
            val p = SnakePoint(Random.nextInt(gridSize), Random.nextInt(gridSize))
            if (!snake.contains(p)) return p
        }
    }

    fun resetGame() {
        snake = listOf(SnakePoint(5, 5), SnakePoint(4, 5), SnakePoint(3, 5))
        food = spawnFood()
        direction = Direction.RIGHT
        isGameOver = false
        score = 0
        isPaused = false
    }

    LaunchedEffect(isGameOver, isPaused) {
        while (!isGameOver && !isPaused) {
            delay(170)
            val head = snake.first()
            val newHead = when (direction) {
                Direction.UP -> SnakePoint(head.x, (head.y - 1 + gridSize) % gridSize)
                Direction.DOWN -> SnakePoint(head.x, (head.y + 1) % gridSize)
                Direction.LEFT -> SnakePoint((head.x - 1 + gridSize) % gridSize, head.y)
                Direction.RIGHT -> SnakePoint((head.x + 1) % gridSize, head.y)
            }

            if (snake.drop(1).contains(newHead)) {
                isGameOver = true
            } else {
                val newSnake = mutableListOf(newHead)
                newSnake.addAll(snake)
                if (newHead == food) {
                    score += 10
                    food = spawnFood()
                } else {
                    newSnake.removeAt(newSnake.size - 1)
                }
                snake = newSnake
            }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0A0F1D))
            .padding(14.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Title Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Games, contentDescription = null, tint = Color(0xFFFFD600), modifier = Modifier.size(22.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Retro Snake Cloud", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Score: $score", color = Color(0xFF00E676), fontSize = 14.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.width(10.dp))
                IconButton(onClick = { resetGame() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Restart", tint = Color.White)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Game Grid Canvas
        Box(
            modifier = Modifier
                .size(280.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFF050811))
                .border(2.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val cellWidth = size.width / gridSize
                val cellHeight = size.height / gridSize

                // Draw Food
                drawRect(
                    color = Color(0xFFFF1744),
                    topLeft = Offset(food.x * cellWidth + 2f, food.y * cellHeight + 2f),
                    size = Size(cellWidth - 4f, cellHeight - 4f)
                )

                // Draw Snake
                for ((idx, segment) in snake.withIndex()) {
                    val color = if (idx == 0) Color(0xFF00E676) else Color(0xFF00B0FF)
                    drawRect(
                        color = color,
                        topLeft = Offset(segment.x * cellWidth + 1.5f, segment.y * cellHeight + 1.5f),
                        size = Size(cellWidth - 3f, cellHeight - 3f)
                    )
                }
            }

            if (isGameOver) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.8f)),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("GAME OVER", color = Color(0xFFEF4444), fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Final Score: $score", color = Color.White, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(14.dp))
                    Button(
                        onClick = { resetGame() },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00E676))
                    ) {
                        Text("Play Again", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // D-Pad Controls
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            // UP
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1E293B))
                    .clickable { if (direction != Direction.DOWN) direction = Direction.UP },
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.ArrowUpward, contentDescription = "Up", tint = Color.White)
            }

            Row(
                modifier = Modifier.padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(40.dp)
            ) {
                // LEFT
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF1E293B))
                        .clickable { if (direction != Direction.RIGHT) direction = Direction.LEFT },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.ArrowLeft, contentDescription = "Left", tint = Color.White)
                }

                // RIGHT
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF1E293B))
                        .clickable { if (direction != Direction.LEFT) direction = Direction.RIGHT },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.ArrowRight, contentDescription = "Right", tint = Color.White)
                }
            }

            // DOWN
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1E293B))
                    .clickable { if (direction != Direction.UP) direction = Direction.DOWN },
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.ArrowDownward, contentDescription = "Down", tint = Color.White)
            }
        }
    }
}
