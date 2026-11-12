# Figures for the week 3 Thursday deck (Data Visualisation 2, part 1).
# Run from the book root:  Rscript _scripts/make-week3-thu-figures.R
# Writes PNGs into images/27_gestalt/.

suppressMessages({
  library(dplyr)
  library(readr)
  library(tidyr)
  library(ggplot2)
  library(patchwork)
})

out <- "images/27_gestalt"
fam <- "Lato"

oi <- c(orange = "#E69F00", sky = "#56B4E9", green = "#009E73",
        blue = "#0072B2", red = "#D55E00", purple = "#CC79A7")
ink <- "#222222"
muted <- "#777777"

save_png <- function(p, file, w, h) {
  ragg::agg_png(file.path(out, file), width = w, height = h, units = "px",
                res = 144, background = "white")
  print(p)
  invisible(dev.off())
}

base <- theme_bw(base_size = 15, base_family = fam) +
  theme(plot.title = element_text(face = "bold", size = 17),
        plot.subtitle = element_text(colour = muted, size = 12),
        panel.grid.minor = element_blank())

# ---------------------------------------------------------------------------
# 1. Pre-attentive attributes: find the odd one out
#    preattentive-1: one dot slightly bigger (slow to find)
#    preattentive-2: one dot a different colour (instant)
# ---------------------------------------------------------------------------

dots <- expand_grid(col = 1:12, row = 1:5)
dot_plot <- function(odd, kind) {
  d <- dots |> mutate(odd = row_number() == odd)
  p <- ggplot(d, aes(col, -row)) + theme_void() +
    coord_fixed(xlim = c(0.5, 12.5), ylim = c(-5.5, -0.5))
  if (kind == "size") {
    p + geom_point(aes(size = odd), colour = "#555555") +
      scale_size_manual(values = c(`FALSE` = 13, `TRUE` = 15.5), guide = "none")
  } else {
    p + geom_point(aes(colour = odd), size = 13) +
      scale_colour_manual(values = c(`FALSE` = "#555555", `TRUE` = oi[["red"]]),
                          guide = "none")
  }
}
save_png(dot_plot(odd = 41, "size"),   "preattentive-1.png", 1800, 760)
save_png(dot_plot(odd = 20, "colour"), "preattentive-2.png", 1800, 760)

# ---------------------------------------------------------------------------
# 2. Grouping: proximity, similarity, enclosure (penguins)
# ---------------------------------------------------------------------------

peng <- palmerpenguins::penguins |> filter(!is.na(bill_length_mm))
p_base <- ggplot(peng, aes(bill_length_mm, flipper_length_mm)) +
  labs(x = "Bill length (mm)", y = "Flipper length (mm)") + base

g1 <- p_base + geom_point(colour = "#555555", alpha = 0.7) +
  labs(title = "Proximity", subtitle = "points close together form a group")
g2 <- p_base + geom_point(aes(colour = species), alpha = 0.8) +
  scale_colour_manual(values = unname(oi[c("orange", "purple", "green")])) +
  theme(legend.position = "bottom", legend.title = element_blank()) +
  labs(title = "Similarity", subtitle = "the same colour forms a group")
g3 <- p_base + geom_point(colour = "#555555", alpha = 0.7) +
  ggforce::geom_mark_ellipse(aes(group = species),
                          colour = oi[["blue"]], expand = unit(2, "mm")) +
  labs(title = "Enclosure", subtitle = "a shared border forms a group")
save_png(g1 + g2 + g3, "gestalt-grouping.png", 2400, 900)

# ---------------------------------------------------------------------------
# 3. Lines: closure, continuity, connection (Nobel)
# ---------------------------------------------------------------------------

nobel <- read_csv("laureates_df.csv", show_col_types = FALSE) |>
  left_join(read_csv("prize_df.csv", show_col_types = FALSE), by = "prize_id") |>
  mutate(decade = floor(award_year / 10) * 10)

physics <- nobel |> filter(category == "Physics") |> count(decade)
three <- nobel |>
  filter(category %in% c("Physics", "Chemistry", "Peace")) |>
  count(decade, category)
dumbbell <- nobel |>
  filter(decade %in% c(1950, 2010)) |>
  count(decade, category) |>
  pivot_wider(names_from = decade, values_from = n, values_fill = 0)

l1 <- ggplot(physics, aes(decade, n)) +
  geom_line(linetype = "dashed", linewidth = 1) +
  labs(title = "Closure", subtitle = "we fill in the gaps in a dashed line",
       x = NULL, y = "Physics laureates") + base
l2 <- ggplot(three, aes(decade, n, colour = category)) +
  geom_line(linewidth = 1) +
  scale_colour_manual(values = unname(oi[c("blue", "orange", "green")])) +
  theme(legend.position = "bottom", legend.title = element_blank()) +
  labs(title = "Continuity", subtitle = "we follow each line through the crossings",
       x = NULL, y = "Laureates") + base +
  theme(legend.position = "bottom", legend.title = element_blank())
l3 <- ggplot(dumbbell, aes(y = reorder(category, `2010`))) +
  geom_segment(aes(x = `1950`, xend = `2010`, yend = category),
               colour = "grey60", linewidth = 1.2) +
  geom_point(aes(x = `1950`), colour = oi[["sky"]], size = 4) +
  geom_point(aes(x = `2010`), colour = oi[["red"]], size = 4) +
  labs(title = "Connection", subtitle = "joined points are read as a pair",
       x = "Laureates: 1950s (blue), 2010s (red)", y = NULL) + base
save_png(l1 + l2 + l3, "gestalt-lines.png", 2400, 900)
