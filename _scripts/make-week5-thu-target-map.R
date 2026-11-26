# Draws images/week5-thu/target-africa.png, the 'make this map' exercise
# in slides/week5-thu.qmd. The code below is also the answer. Run from the book root.
library(dplyr)
library(ggplot2)
library(sf)
library(rnaturalearth)

worldmap <- ne_countries(scale = 'medium', returnclass = 'sf') |>
  filter(continent != 'Antarctica')

africa <- worldmap |>
  filter(continent == 'Africa')

p <- ggplot() +
  geom_sf(data = africa, aes(fill = income_grp), colour = 'white', linewidth = 0.2) +
  scale_fill_brewer(palette = 'YlGnBu', direction = -1) +
  coord_sf(crs = '+proj=eqearth') +
  labs(title = 'Income groups in Africa',
       subtitle = 'World Bank income group of each country',
       fill = 'Income group',
       caption = 'Data: Natural Earth') +
  theme_void(base_size = 16)

ggsave('images/week5-thu/target-africa.png', p, width = 8, height = 6.5, dpi = 150, bg = 'white')
