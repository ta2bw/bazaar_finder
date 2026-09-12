package com.bazaarfinder.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bazaarfinder.app.data.Bazaar
import com.bazaarfinder.app.data.TURKISH_DAY_NAMES
import com.bazaarfinder.app.data.TodoItem
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Calendar

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFFEA580C),
                    background = Color(0xFF020617),
                    surface = Color(0xFF0F172A),
                    onBackground = Color(0xFFF8FAFC),
                    onSurface = Color(0xFFF8FAFC)
                )
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    BazaarApp()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BazaarApp() {
    val context = LocalContext.current
    var currentTab by remember { mutableStateOf(0) } // 0: Bazaars, 1: Shopping List

    // Load offline JSON bazaars from assets
    val bazaars = remember {
        try {
            val jsonString = context.assets.open("allBazaars.json").bufferedReader().use { it.readText() }
            val listType = object : TypeToken<List<Bazaar>>() {}.type
            Gson().fromJson<List<Bazaar>>(jsonString, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    // Current Day Index in Turkey (Sunday=0, Monday=1, ..., Saturday=6)
    val currentDayIndex = remember {
        val cal = Calendar.getInstance()
        cal.get(Calendar.DAY_OF_WEEK) - 1
    }

    // Shopping List State
    var todos by remember {
        mutableStateOf(
            listOf(
                TodoItem("1", "Domates", "Sebze", "2 kg", false),
                TodoItem("2", "Salatalık", "Sebze", "1 kg", false),
                TodoItem("3", "Maydanoz", "Yeşillik", "2 demet", true),
                TodoItem("4", "Köy Yumurtası", "Şarküteri", "1 koli", false)
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color(0xFFEA580C)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.Storefront,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    "Bazaar Finder",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color(0xFF10B981).copy(alpha = 0.2f))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        "Çevrimdışı",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF34D399)
                                    )
                                }
                            }
                            Text(
                                "hal.gov.tr resmi semt pazarları",
                                fontSize = 11.sp,
                                color = Color(0xFF94A3B8)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A)
                )
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color(0xFF0F172A)) {
                NavigationBarItem(
                    selected = currentTab == 0,
                    onClick = { currentTab = 0 },
                    icon = { Icon(Icons.Default.Storefront, contentDescription = "Pazarlar") },
                    label = { Text("Semt Pazarları") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFEA580C),
                        selectedTextColor = Color(0xFFEA580C),
                        indicatorColor = Color(0xFFEA580C).copy(alpha = 0.2f)
                    )
                )
                NavigationBarItem(
                    selected = currentTab == 1,
                    onClick = { currentTab = 1 },
                    icon = {
                        BadgedBox(badge = {
                            val uncompleted = todos.count { !it.completed }
                            if (uncompleted > 0) {
                                Badge(containerColor = Color(0xFFEA580C)) { Text("$uncompleted") }
                            }
                        }) {
                            Icon(Icons.Default.ShoppingBag, contentDescription = "Alışveriş")
                        }
                    },
                    label = { Text("Alışveriş Listem") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFEA580C),
                        selectedTextColor = Color(0xFFEA580C),
                        indicatorColor = Color(0xFFEA580C).copy(alpha = 0.2f)
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            if (currentTab == 0) {
                BazaarsScreen(bazaars = bazaars, todayIndex = currentDayIndex)
            } else {
                ShoppingListScreen(
                    todos = todos,
                    onToggle = { id ->
                        todos = todos.map { if (it.id == id) it.copy(completed = !it.completed) else it }
                    },
                    onDelete = { id ->
                        todos = todos.filter { it.id !== id }
                    },
                    onAdd = { text, qty, category ->
                        val newItem = TodoItem(
                            id = System.currentTimeMillis().toString(),
                            text = text,
                            category = category,
                            quantity = qty.ifBlank { null },
                            completed = false
                        )
                        todos = listOf(newItem) + todos
                    }
                )
            }
        }
    }
}

@Composable
fun BazaarsScreen(bazaars: List<Bazaar>, todayIndex: Int) {
    val context = LocalContext.current
    var selectedPlate by remember { mutableIntStateOf(6) } // Default 06 Ankara
    var searchQuery by remember { mutableStateOf("") }
    var selectedDayFilter by remember { mutableStateOf("today") } // "today", "all", or "0".."6"

    val provinceBazaars = remember(selectedPlate, bazaars) {
        bazaars.filter { it.plate == selectedPlate }
    }

    val filteredList = remember(provinceBazaars, searchQuery, selectedDayFilter, todayIndex) {
        provinceBazaars.filter { b ->
            val dayMatches = when (selectedDayFilter) {
                "today" -> b.openDays.contains(todayIndex)
                "all" -> true
                else -> b.openDays.contains(selectedDayFilter.toIntOrNull() ?: -1)
            }

            val textMatches = if (searchQuery.isBlank()) true else {
                val q = searchQuery.trim().lowercase()
                b.name.lowercase().contains(q) ||
                b.district.lowercase().contains(q) ||
                (b.neighborhood?.lowercase()?.contains(q) == true) ||
                b.address.lowercase().contains(q) ||
                b.daysRaw.lowercase().contains(q)
            }

            dayMatches && textMatches
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Search & Filter Box
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Search text field
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Pazar adı, ilçe veya mahalle ara...", fontSize = 13.sp) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Color.Gray) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFEA580C),
                            unfocusedBorderColor = Color(0xFF1E293B)
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Day Filter Chips
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "Kuruluş Günleri Filtresi",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF94A3B8)
                        )
                        Text(
                            "Bugün: ${TURKISH_DAY_NAMES[todayIndex]}",
                            fontSize = 10.sp,
                            color = Color(0xFF64748B)
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        item {
                            FilterChip(
                                selected = selectedDayFilter == "today",
                                onClick = { selectedDayFilter = "today" },
                                label = { Text("Bugün Açık") },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color(0xFF10B981),
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                        item {
                            FilterChip(
                                selected = selectedDayFilter == "all",
                                onClick = { selectedDayFilter = "all" },
                                label = { Text("Tüm Günler (${provinceBazaars.size})") },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color(0xFFEA580C),
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                        items(listOf(1, 2, 3, 4, 5, 6, 0)) { d ->
                            FilterChip(
                                selected = selectedDayFilter == d.toString(),
                                onClick = { selectedDayFilter = d.toString() },
                                label = { Text(TURKISH_DAY_NAMES[d]) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color(0xFFEA580C),
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }
                }
            }
        }

        // List Status Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "${filteredList.size} Pazar Listeleniyor",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color.White
                )
                Text(
                    "Toplam 2.741 pazar çevrimdışı",
                    fontSize = 11.sp,
                    color = Color(0xFF64748B)
                )
            }
        }

        // Bazaar items
        items(filteredList) { bazaar ->
            val isOpenToday = bazaar.openDays.contains(todayIndex)

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    // Status Badge & District
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (isOpenToday) Color(0xFF10B981).copy(alpha = 0.2f)
                                    else Color(0xFF1E293B)
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                if (isOpenToday) "Bugün Açık" else "Bugün Kapalı",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isOpenToday) Color(0xFF34D399) else Color(0xFF94A3B8)
                            )
                        }

                        Text(
                            "${bazaar.city} / ${bazaar.district}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF94A3B8)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Title
                    Text(
                        bazaar.name,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    if (!bazaar.neighborhood.isNullOrBlank()) {
                        Text(
                            "Semt: ${bazaar.neighborhood}",
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Address with Clickable Map Link
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFF020617).copy(alpha = 0.6f),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                val query = Uri.encode("${bazaar.name}, ${bazaar.address}, ${bazaar.district}, ${bazaar.city}")
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=$query"))
                                context.startActivity(intent)
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(8.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Icon(
                                Icons.Default.Place,
                                contentDescription = null,
                                tint = Color(0xFFEA580C),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                bazaar.address.ifBlank { "Adres kaydı sistemde belirtilmemiş." },
                                fontSize = 12.sp,
                                color = Color(0xFFCBD5E1),
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.weight(1f)
                            )
                            Icon(
                                Icons.Default.OpenInNew,
                                contentDescription = "Haritada Aç",
                                tint = Color(0xFF94A3B8),
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Separate Kuruluş Günleri Badges
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.CalendarToday,
                            contentDescription = null,
                            tint = Color(0xFFEA580C),
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            "Kuruluş Günleri:",
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            bazaar.openDays.forEach { d ->
                                val isDayToday = d == todayIndex
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(
                                            if (isDayToday) Color(0xFF10B981).copy(alpha = 0.25f)
                                            else Color(0xFFEA580C).copy(alpha = 0.15f)
                                        )
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        TURKISH_DAY_NAMES.getOrNull(d) ?: "Gün $d",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isDayToday) Color(0xFF34D399) else Color(0xFFEA580C)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ShoppingListScreen(
    todos: List<TodoItem>,
    onToggle: (String) -> Unit,
    onDelete: (String) -> Unit,
    onAdd: (String, String, String) -> Unit
) {
    val context = LocalContext.current
    var textInput by remember { mutableStateOf("") }
    var qtyInput by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Sebze") }

    val categories = listOf("Sebze", "Meyve", "Yeşillik", "Şarküteri", "Kuru Gıda", "Diğer")

    val completedCount = todos.count { it.completed }
    val totalCount = todos.size

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Stats & Native Android Share Button
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                "Alışveriş Listesi",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                "$completedCount/$totalCount ürün tamamlandı",
                                fontSize = 12.sp,
                                color = Color(0xFFEA580C)
                            )
                        }

                        // Native Share Action
                        Button(
                            onClick = {
                                val sb = StringBuilder()
                                sb.append("🛒 PAZAR ALIŞVERİŞ LİSTESİ\n\n")
                                todos.forEach { t ->
                                    val check = if (t.completed) "[✓]" else "[ ]"
                                    val qty = if (t.quantity != null) " (${t.quantity})" else ""
                                    sb.append("$check ${t.text}$qty - ${t.category}\n")
                                }
                                sb.append("\nToplam: $totalCount ürün ($completedCount alındı)")

                                val sendIntent = Intent().apply {
                                    action = Intent.ACTION_SEND
                                    putExtra(Intent.EXTRA_TEXT, sb.toString())
                                    type = "text/plain"
                                }
                                context.startActivity(Intent.createChooser(sendIntent, "Listeyi Paylaş"))
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEA580C)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Paylaş", fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Add Form
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    // Category Chips
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(categories) { cat ->
                            FilterChip(
                                selected = selectedCategory == cat,
                                onClick = { selectedCategory = cat },
                                label = { Text(cat) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color(0xFFEA580C),
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(modifier = Modifier.fillMaxWidth()) {
                        OutlinedTextField(
                            value = textInput,
                            onValueChange = { textInput = it },
                            placeholder = { Text("Ürün adı...", fontSize = 12.sp) },
                            modifier = Modifier.weight(1.5f),
                            singleLine = true,
                            shape = RoundedCornerShape(10.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        OutlinedTextField(
                            value = qtyInput,
                            onValueChange = { qtyInput = it },
                            placeholder = { Text("Miktar...", fontSize = 12.sp) },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            shape = RoundedCornerShape(10.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        IconButton(
                            onClick = {
                                if (textInput.isNotBlank()) {
                                    onAdd(textInput.trim(), qtyInput.trim(), selectedCategory)
                                    textInput = ""
                                    qtyInput = ""
                                }
                            },
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color(0xFFEA580C))
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Ekle", tint = Color.White)
                        }
                    }
                }
            }
        }

        // List items
        items(todos) { item ->
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onToggle(item.id) }
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = item.completed,
                        onCheckedChange = { onToggle(item.id) },
                        colors = CheckboxDefaults.colors(checkedColor = Color(0xFF10B981))
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            item.text,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (item.completed) Color(0xFF64748B) else Color.White,
                            textDecoration = if (item.completed) TextDecoration.LineThrough else TextDecoration.None
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                item.category,
                                fontSize = 10.sp,
                                color = Color(0xFF94A3B8)
                            )
                            if (!item.quantity.isNullOrBlank()) {
                                Text(
                                    " • ${item.quantity}",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFFEA580C)
                                )
                            }
                        }
                    }
                    IconButton(onClick = { onDelete(item.id) }) {
                        Icon(Icons.Default.Delete, contentDescription = "Sil", tint = Color(0xFF64748B))
                    }
                }
            }
        }
    }
}
