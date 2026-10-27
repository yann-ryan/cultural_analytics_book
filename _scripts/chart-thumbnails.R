# Draws the small chart thumbnails used in the 'Choosing a chart' table in
# 24_chart-types.qmd, from the same Nobel data used in the chapter.
# Run from the book's root folder: Rscript _scripts/chart-thumbnails.R

library(dplyr)
library(readr)
library(tidyr)
library(stringr)
library(ggplot2)
library(sf)
library(rnaturalearth)

base <- "https://raw.githubusercontent.com/yann-ryan/infovis_data/main/nobel/"
laureates_df <- read_csv(paste0(base, "laureates_df.csv"), show_col_types = FALSE)
prize_df <- read_csv(paste0(base, "prize_df.csv"), show_col_types = FALSE)

nobel_df <- laureates_df |>
  left_join(prize_df, by = 'prize_id') |>
  mutate(birth_year = as.numeric(str_sub(birth_date, 1, 4)),
         age_at_award = award_year - birth_year,
         decade = floor(award_year / 10) * 10)

accent <- "#2780e3" # the 'cosmo' theme blue used by the book
muted <- "#c9d3dd"

# No text, gridlines or legends: at thumbnail size, only the shape matters.
theme_thumb <- theme_void() +
  theme(plot.background = element_rect(fill = "white", colour = NA),
        plot.margin = margin(8, 8, 8, 8),
        legend.position = "none",
        strip.text = element_blank(),
        panel.spacing = unit(4, "pt"))

baseline <- geom_hline(yintercept = 0, colour = "grey60", linewidth = 0.4)

# 'extra' is added after theme_thumb, which would otherwise override it.
save_thumb <- function(plot, name, extra = theme()) {
  ggsave(file.path("images/24_chart-types", paste0("thumb-", name, ".png")),
         plot + theme_thumb + extra, width = 1.8, height = 1.2, dpi = 200, bg = "white")
}

# Amounts: laureates per category
p <- nobel_df |>
  count(category) |>
  ggplot(aes(x = category, y = n)) +
  geom_col(fill = accent, width = 0.7) +
  baseline
save_thumb(p, "amounts")

# Ranking: average age at award, ordered (lollipop)
p <- nobel_df |>
  group_by(category) |>
  summarise(avg_age = mean(age_at_award, na.rm = TRUE)) |>
  ggplot(aes(x = reorder(category, avg_age), y = avg_age)) +
  geom_segment(aes(xend = reorder(category, avg_age), y = 0, yend = avg_age),
               colour = muted, linewidth = 1) +
  geom_point(colour = accent, size = 2.5) +
  coord_flip()
save_thumb(p, "ranking")

# Distribution: age at award
p <- nobel_df |>
  ggplot(aes(x = age_at_award)) +
  geom_histogram(binwidth = 4, fill = accent, colour = "white", linewidth = 0.2) +
  baseline
save_thumb(p, "distribution")

# Relationship: age at award against year of award
p <- nobel_df |>
  ggplot(aes(x = award_year, y = age_at_award)) +
  geom_point(colour = accent, alpha = 0.35, size = 0.6)
save_thumb(p, "relationship")

# Change over time: laureates per decade (complete decades only)
p <- nobel_df |>
  filter(decade < 2020) |>
  count(decade) |>
  ggplot(aes(x = decade, y = n)) +
  geom_line(colour = accent, linewidth = 1) +
  baseline
save_thumb(p, "time")

# Part-to-whole: share of women in each category
p <- nobel_df |>
  count(category, gender) |>
  ggplot(aes(x = category, y = n, fill = gender)) +
  geom_col(position = 'fill', width = 0.7) +
  scale_fill_manual(values = c(female = accent, male = muted))
save_thumb(p, "part-to-whole")

# Comparison across groups: laureates per decade, one panel per category
p <- nobel_df |>
  filter(decade < 2020) |>
  count(decade, category) |>
  ggplot(aes(x = decade, y = n)) +
  geom_line(colour = accent, linewidth = 0.6) +
  facet_wrap(~ category, nrow = 2)
save_thumb(p, "comparison",
           theme(panel.background = element_rect(fill = "#f3f5f7", colour = NA)))

# Spatial: laureates by country of birth
births <- nobel_df |> count(iso_birth_country_now, name = "n")
p <- ne_countries(scale = "small", returnclass = "sf") |>
  filter(continent != "Antarctica") |>
  left_join(births, by = c("adm0_a3" = "iso_birth_country_now")) |>
  ggplot() +
  geom_sf(aes(fill = n), colour = "white", linewidth = 0.05) +
  scale_fill_gradient(low = "#cfe2f8", high = accent, trans = "log10",
                      na.value = "#eef0f2") +
  coord_sf(crs = "+proj=robin", expand = FALSE)
save_thumb(p, "spatial", theme(plot.margin = margin(2, 2, 2, 2)))
