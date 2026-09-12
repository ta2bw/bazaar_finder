package com.bazaarfinder.app.data

import com.google.gson.annotations.SerializedName

data class Bazaar(
    @SerializedName("id") val id: String,
    @SerializedName("plate") val plate: Int,
    @SerializedName("city") val city: String,
    @SerializedName("district") val district: String,
    @SerializedName("neighborhood") val neighborhood: String?,
    @SerializedName("name") val name: String,
    @SerializedName("type") val type: String?,
    @SerializedName("daysRaw") val daysRaw: String,
    @SerializedName("openDays") val openDays: List<Int>,
    @SerializedName("address") val address: String
)

data class TodoItem(
    val id: String,
    val text: String,
    val category: String,
    val quantity: String? = null,
    val completed: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

val TURKISH_DAY_NAMES = listOf(
    "Pazar",      // 0
    "Pazartesi",  // 1
    "Salı",       // 2
    "Çarşamba",   // 3
    "Perşembe",   // 4
    "Cuma",       // 5
    "Cumartesi"   // 6
)
