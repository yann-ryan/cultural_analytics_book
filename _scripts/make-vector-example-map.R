# Draws images/42_digital-mapping-1/07.png, the vector-map example (ch. 57 and week5-thu deck). Run from the book root.
suppressMessages({library(sf);library(rnaturalearth);library(ggplot2);library(dplyr)})
sf_use_s2(FALSE)
countries <- ne_download(scale = 10, type = "countries", returnclass = "sf") |> filter(ADMIN %in% c("Netherlands","Belgium","Germany","Luxembourg","France")) |> rename(admin = ADMIN)
rivers <- ne_download(scale = 10, type = "rivers_lake_centerlines", category = "physical", returnclass = "sf") |> filter(name %in% c("Maas","Rhein","Rhine","Waal","IJssel","Schelde"))
cities <- st_as_sf(data.frame(
  name = c("Amsterdam","Rotterdam","Utrecht","Brussels","Antwerp","Cologne","Leiden"),
  lon = c(4.90, 4.48, 5.12, 4.35, 4.40, 6.96, 4.49),
  lat = c(52.37, 51.92, 52.09, 50.85, 51.22, 50.94, 52.16)),
  coords = c("lon","lat"), crs = 4326)
river_lab <- data.frame(lon = c(7.3, 5.45), lat = c(51.62, 51.02), lab = c("Rhine","Maas"))
ink <- "#222222"
p <- ggplot() +
  geom_sf(data = countries, fill = "#f1ede4", colour = "#8a6d3b", linewidth = 0.5) +
  geom_sf(data = countries |> filter(admin == "Netherlands"), fill = "#f6d9a8", colour = "#8a6d3b", linewidth = 0.7) +
  geom_sf(data = rivers, colour = "#2f7fc1", linewidth = 1.1) +
  geom_sf(data = cities, colour = "#c0392b", size = 3.2) +
  geom_sf_text(data = cities |> filter(name != "Leiden"), aes(label = name), nudge_x = 0.1, hjust = 0, size = 4.8, colour = ink) +
  geom_sf_text(data = cities |> filter(name == "Leiden"), aes(label = name), nudge_x = -0.1, hjust = 1, size = 4.8, colour = ink) +
  geom_text(data = river_lab, aes(lon, lat, label = lab), colour = "#2f7fc1", fontface = "italic", size = 5.2) +
  annotate("text", x = 5.75, y = 52.75, label = "Netherlands", fontface = "bold", size = 6, colour = "#7a5a1e") +
  annotate("text", x = 4.3, y = 50.45, label = "Belgium", size = 5.2, colour = "#7a5a1e") +
  annotate("text", x = 7.7, y = 51.75, label = "Germany", size = 5.2, colour = "#7a5a1e") +
  coord_sf(xlim = c(2.9, 8.5), ylim = c(50.3, 53.6), expand = FALSE) +
  theme_void() +
  theme(panel.background = element_rect(fill = "#dcebf5", colour = NA))
ggsave("images/42_digital-mapping-1/07.png", p, width = 6.2, height = 5.9, dpi = 200, bg = "white")
