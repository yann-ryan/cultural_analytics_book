# Figures for the week 3 Tuesday deck (Data Visualisation 1).
# Run from the book root:  Rscript _scripts/make-week3-figures.R
# Writes PNGs into images/22_data-visualisation-1/.

suppressMessages({
  library(dplyr)
  library(readr)
  library(ggplot2)
  library(patchwork)
})

out <- "images/22_data-visualisation-1"
fam <- "Lato"
mono <- "Menlo"

# Okabe-Ito
oi <- c(orange = "#E69F00", sky = "#56B4E9", green = "#009E73",
        yellow = "#F0E442", blue = "#0072B2", red = "#D55E00",
        purple = "#CC79A7")
ink <- "#222222"
muted <- "#666666"
grid_col <- "#BBBBBB"

titanic <- read_csv("titanic_df_full.csv", show_col_types = FALSE)

save_png <- function(p, file, w, h) {
  ragg::agg_png(file.path(out, file), width = w, height = h, units = "px",
                res = 144, background = "white")
  print(p)
  invisible(dev.off())
}

# ---------------------------------------------------------------------------
# 1. Types of data
# ---------------------------------------------------------------------------

col_x <- c(2, 6, 10.4, 14.4)        # centres of the four columns
type_col <- c(oi[["blue"]], oi[["blue"]], oi[["red"]], oi[["red"]])

set.seed(4)
ages <- sample(na.omit(titanic$age), 22)
age_x <- col_x[1] - 1.6 + ages / 80 * 3.2

sib <- titanic |> count(sibsp)
sib_pts <- sib |>
  rowwise() |>
  # one dot per ~120 passengers (rounded up), stacked above the tick
  reframe(sibsp = sibsp, k = seq_len(ceiling(n / 120))) |>
  mutate(x = col_x[2] - 1.6 + sibsp / 8 * 3.2, y = 4.3 + (k - 1) * 0.15)

line_y <- 4.2
text_df <- tibble(
  x = col_x,
  name = c("Continuous", "Discrete", "Categorical", "Ordinal"),
  alt = c("", "", "(nominal)", ""),
  def = c("can take any value\nin a range",
          "whole numbers only,\nusually counts",
          "named groups,\nno order",
          "named groups,\nwith an order"),
  ex = c("age, fare", "sibsp", "sex, embarked", "pclass, month"),
  rtype = c("<dbl>", "<int>\n(read_csv: <dbl>)", "<chr>", "<dbl> / <chr>\nor a factor"),
  suits = c("position · length · size ·\nlightness (a gradient)",
            "position · length · size",
            "position · hue · shape",
            "position · lightness ·\nsize (in order)")
)

# categorical: three tiles in no particular order
cat_tiles <- tibble(lab = c("S", "C", "Q"),
                    x = col_x[3] + c(-1.15, 0.05, 1.15),
                    y = line_y + c(0.15, 0.55, 0.05),
                    fill = c(oi[["orange"]], oi[["sky"]], oi[["green"]]))
# ordinal: three rising steps
ord_steps <- tibble(lab = c("1st", "2nd", "3rd"),
                    x = col_x[4] + c(-1.15, 0, 1.15),
                    h = c(0.35, 0.7, 1.05))

p_types <- ggplot() +
  # group headers
  annotate("text", x = mean(col_x[1:2]), y = 8.55, label = "Numbers",
           family = fam, fontface = "bold", size = 10.5, colour = oi[["blue"]]) +
  annotate("text", x = mean(col_x[1:2]), y = 8.0, label = "quantitative",
           family = fam, size = 6.5, colour = muted) +
  annotate("text", x = mean(col_x[3:4]), y = 8.55, label = "Categories",
           family = fam, fontface = "bold", size = 10.5, colour = oi[["red"]]) +
  annotate("text", x = mean(col_x[3:4]), y = 8.0, label = "qualitative",
           family = fam, size = 6.5, colour = muted) +
  annotate("segment", x = col_x[1] - 1.6, xend = col_x[2] + 1.6,
           y = 7.65, yend = 7.65, colour = oi[["blue"]], linewidth = 1.2) +
  annotate("segment", x = col_x[3] - 1.6, xend = col_x[4] + 1.6,
           y = 7.65, yend = 7.65, colour = oi[["red"]], linewidth = 1.2) +
  # type names and definitions
  geom_text(data = text_df, aes(x, 7.05, label = name), family = fam,
            fontface = "bold", size = 9, colour = type_col) +
  geom_text(data = text_df, aes(x, 6.55, label = alt), family = fam,
            size = 6, colour = muted) +
  geom_text(data = text_df, aes(x, 5.9, label = def), family = fam,
            size = 6.3, colour = ink, lineheight = 0.95) +
  # continuous glyph
  annotate("segment", x = col_x[1] - 1.6, xend = col_x[1] + 1.6,
           y = line_y, yend = line_y, colour = ink, linewidth = 0.8) +
  annotate("segment", x = col_x[1] - 1.6 + 0:4 * 0.8,
           xend = col_x[1] - 1.6 + 0:4 * 0.8,
           y = line_y - 0.08, yend = line_y + 0.08, colour = ink) +
  annotate("text", x = col_x[1] - 1.6 + 0:4 * 0.8, y = line_y - 0.32,
           label = c(0, 20, 40, 60, 80), family = fam, size = 5,
           colour = muted) +
  annotate("point", x = age_x, y = line_y + 0.3 + runif(22, 0, 0.5),
           shape = 21, size = 4, fill = oi[["blue"]], colour = "white",
           stroke = 0.4) +
  # discrete glyph
  annotate("segment", x = col_x[2] - 1.6, xend = col_x[2] + 1.6,
           y = line_y, yend = line_y, colour = ink, linewidth = 0.8) +
  annotate("segment", x = col_x[2] - 1.6 + 0:8 * 0.4,
           xend = col_x[2] - 1.6 + 0:8 * 0.4,
           y = line_y - 0.08, yend = line_y + 0.08, colour = ink) +
  annotate("text", x = col_x[2] - 1.6 + 0:8 * 0.4, y = line_y - 0.32,
           label = 0:8, family = fam, size = 5, colour = muted) +
  geom_point(data = sib_pts, aes(x, y + 0.05), shape = 21, size = 4,
             fill = oi[["blue"]], colour = "white", stroke = 0.4) +
  # categorical glyph
  geom_label(data = cat_tiles, aes(x, y + 0.25, label = lab, fill = fill),
             family = fam, fontface = "bold", size = 8.5, colour = "white",
             linewidth = 0, label.padding = unit(0.45, "lines")) +
  # ordinal glyph
  geom_rect(data = ord_steps, aes(xmin = x - 0.48, xmax = x + 0.48,
                                  ymin = line_y - 0.05, ymax = line_y - 0.05 + h),
            fill = oi[["red"]], alpha = c(0.45, 0.7, 1)) +
  geom_text(data = ord_steps, aes(x, line_y - 0.32, label = lab),
            family = fam, size = 5.6, colour = ink) +
  # Titanic example and R type
  geom_text(data = text_df, aes(x, 3.25, label = "in the Titanic data"),
            family = fam, size = 5, colour = muted) +
  geom_text(data = text_df, aes(x, 2.8, label = ex), family = mono,
            size = 6.3, colour = ink) +
  geom_text(data = text_df, aes(x, 2.25, label = rtype), family = mono,
            size = 6, colour = type_col, vjust = 1, lineheight = 0.95) +
  # what it suits
  annotate("rect", xmin = 0, xmax = 16.4, ymin = -0.05, ymax = 1.2,
           fill = "#F3F3F3") +
  annotate("text", x = 0.15, y = 1.0, label = "good aesthetics:", hjust = 0,
           family = fam, size = 4.8, colour = muted) +
  geom_text(data = text_df, aes(x, 0.45, label = suits), family = fam,
            size = 5.6, colour = ink, lineheight = 0.95) +
  scale_fill_identity() +
  coord_cartesian(xlim = c(0, 16.4), ylim = c(-0.05, 8.9), expand = FALSE) +
  theme_void()

save_png(p_types, "data-types.png", 2000, 1080)

# ---------------------------------------------------------------------------
# 2. Mapping columns to aesthetics
# ---------------------------------------------------------------------------

surv <- titanic |>
  group_by(pclass, sex) |>
  summarise(survival = mean(survived), .groups = "drop")

sex_fill <- c(female = oi[["orange"]], male = oi[["sky"]])
map_col <- c(x = oi[["blue"]], y = oi[["red"]], fill = oi[["green"]])

tab <- surv |>
  mutate(row = row_number(), yy = 7.1 - row * 0.95,
         surv_lab = sprintf("%.2f", survival))
cx <- c(pclass = 1, sex = 2.8, survival = 4.75)

p_table <- ggplot() +
  # header
  annotate("text", x = cx, y = 7.15, label = names(cx), family = mono,
           fontface = "bold", size = 7.6, colour = ink) +
  annotate("segment", x = 0.2, xend = 5.6, y = 6.65, yend = 6.65,
           colour = ink, linewidth = 0.5) +
  # rows
  geom_text(data = tab, aes(cx[["pclass"]], yy, label = pclass),
            family = mono, size = 7.6, colour = ink) +
  geom_point(data = tab, aes(cx[["sex"]] - 0.75, yy, fill = sex), shape = 22,
             size = 6.5, colour = "white") +
  geom_text(data = tab, aes(cx[["sex"]] - 0.45, yy, label = sex), hjust = 0,
            family = mono, size = 7.6, colour = ink) +
  geom_text(data = tab, aes(cx[["survival"]], yy, label = surv_lab),
            family = mono, size = 7.6, colour = ink) +
  # mapping row
  annotate("label", x = cx, y = -0.15,
           label = c("x", "fill", "y"), family = mono, fontface = "bold",
           size = 8.8, colour = "white", fill = map_col[c("x", "fill", "y")],
           linewidth = 0, label.padding = unit(0.4, "lines")) +
  annotate("segment", x = cx, xend = cx, y = 0.95, yend = 0.3,
           colour = map_col[c("x", "fill", "y")], linewidth = 1,
           arrow = arrow(length = unit(8, "pt"), type = "closed")) +
  annotate("text", x = cx, y = -0.95,
           label = c("left to right", "colour", "height"),
           family = fam, size = 6, colour = muted) +
  scale_fill_manual(values = sex_fill, guide = "none") +
  coord_cartesian(xlim = c(0.1, 5.7), ylim = c(-1.3, 7.6), expand = FALSE) +
  theme_void()

p_chart <- ggplot(surv, aes(x = factor(pclass), y = survival, fill = sex)) +
  geom_col(position = position_dodge(width = 0.82), width = 0.78) +
  scale_fill_manual(values = sex_fill) +
  scale_y_continuous(limits = c(0, 1), expand = expansion(mult = c(0, 0.02))) +
  labs(x = "pclass", y = "survival", fill = "sex") +
  theme_minimal(base_size = 22, base_family = fam) +
  theme(panel.grid.major.x = element_blank(),
        panel.grid.minor = element_blank(),
        axis.title.x = element_text(colour = map_col[["x"]], face = "bold",
                                    family = mono, margin = margin(t = 8)),
        axis.title.y = element_text(colour = map_col[["y"]], face = "bold",
                                    family = mono, margin = margin(r = 8)),
        legend.title = element_text(colour = map_col[["fill"]],
                                    face = "bold", family = mono),
        legend.position = "right")

p_arrow <- ggplot() +
  annotate("segment", x = 0, xend = 1, y = 0, yend = 0, linewidth = 1.6,
           colour = grid_col,
           arrow = arrow(length = unit(14, "pt"), type = "closed")) +
  coord_cartesian(xlim = c(-0.1, 1.1), ylim = c(-1, 1)) +
  theme_void()

p_map <- p_table + p_arrow + p_chart +
  plot_layout(widths = c(1.15, 0.22, 1.4))

save_png(p_map, "mapping.png", 2000, 960)

# ---------------------------------------------------------------------------
# 3. Same six numbers, three mappings
# ---------------------------------------------------------------------------

base3 <- theme_minimal(base_size = 16, base_family = fam) +
  theme(panel.grid.minor = element_blank(),
        plot.title = element_text(family = mono, size = 13.5, colour = ink,
                                  margin = margin(b = 4)),
        plot.subtitle = element_text(size = 13, colour = muted,
                                     margin = margin(b = 10)),
        plot.title.position = "plot",
        legend.position = "bottom",
        legend.title = element_text(size = 12),
        legend.text = element_text(size = 11))

s <- surv |> mutate(pclass = factor(pclass))

pa <- ggplot(s, aes(x = pclass, y = survival, fill = sex)) +
  geom_col(position = position_dodge(width = 0.82), width = 0.78) +
  scale_fill_manual(values = sex_fill) +
  scale_y_continuous(limits = c(0, 1), expand = expansion(mult = c(0, 0.02))) +
  labs(title = "aes(x = pclass, y = survival,\n    fill = sex)",
       subtitle = "survival as height") +
  base3 + theme(panel.grid.major.x = element_blank())

pb <- ggplot(s, aes(x = pclass, y = sex, size = survival)) +
  geom_point(colour = oi[["blue"]]) +
  scale_size_area(max_size = 16, limits = c(0, 1),
                  breaks = c(0.25, 0.5, 0.75)) +
  labs(title = "aes(x = pclass, y = sex,\n    size = survival)",
       subtitle = "survival as the size of a circle") +
  base3 + theme(panel.grid.major = element_line(colour = "#EEEEEE"))

pc <- ggplot(s, aes(x = pclass, y = sex, fill = survival)) +
  geom_tile(colour = "white", linewidth = 2) +
  scale_fill_gradient(low = "#DCEAF5", high = "#08306B", limits = c(0, 1),
                      breaks = c(0, 0.5, 1)) +
  labs(title = "aes(x = pclass, y = sex,\n    fill = survival)",
       subtitle = "survival as a shade of colour") +
  base3 + theme(panel.grid = element_blank(),
                legend.key.width = unit(28, "pt"))

p_three <- pa + pb + pc + plot_layout(nrow = 1)

save_png(p_three, "three-mappings.png", 2000, 820)

cat("wrote data-types.png, mapping.png, three-mappings.png to", out, "\n")

# ---------------------------------------------------------------------------
# 4. The layers of a ggplot (abstract stack)
# ---------------------------------------------------------------------------

layers <- tibble(
  name = c("Data", "Aesthetics", "Geometries", "Statistics",
           "Scales", "Facets", "Coordinates", "Theme"),
  code = c("ggplot(data = df)",
           "aes(x = ..., y = ..., colour = ...)",
           "geom_point()  geom_col()  geom_line()",
           "geom_histogram() counts for you",
           "scale_y_continuous()  scale_fill_...()",
           "facet_wrap(~ category)",
           "coord_flip()  coord_sf()",
           "theme_minimal()  theme()"),
  desc = c("the table: one row per observation",
           "which column goes to which aesthetic",
           "the shapes that are drawn",
           "calculations made while drawing",
           "how values become positions, sizes and colours: axes, legends, palettes",
           "split into small multiples",
           "the space it is drawn in: flipped axes, map projections",
           "everything that isn't data: fonts, background, grid lines"),
  when = c("today", "today", "today", "today",
           "Thu 12 & Tue 17 Nov", "today", "weeks 5-6", "Thu 19 Nov")
) |>
  mutate(i = row_number() - 1, now = when == "today")

W <- 3.4; D <- 1.1; H <- 0.62; gap <- 1.0; x0 <- 1.25
tr <- function(u, v, i) tibble(X = x0 + u * W + v * D, Y = i * gap + v * H)

slab_poly <- layers |>
  rowwise() |>
  reframe(i = i, now = now, tr(c(0, 1, 1, 0), c(0, 0, 1, 1), i))

# small abstract icon for each layer, in slab coordinates (u, v)
icon_segs <- function(i) {
  seg <- function(u, v, uu, vv) tibble(u = u, v = v, uu = uu, vv = vv)
  switch(i + 1,
    # data: a little table
    bind_rows(seg(0.12, c(0.2, 0.4, 0.6, 0.8), 0.52, c(0.2, 0.4, 0.6, 0.8)),
              seg(c(0.12, 0.25, 0.39, 0.52), 0.2, c(0.12, 0.25, 0.39, 0.52), 0.8)),
    # aesthetics: arrows
    seg(c(0.12, 0.12, 0.12), c(0.25, 0.5, 0.75), c(0.45, 0.45, 0.45), c(0.25, 0.5, 0.75)),
    # geometries: a bar and a zigzag line
    bind_rows(seg(c(0.3, 0.3, 0.38), c(0.2, 0.2, 0.2), c(0.3, 0.38, 0.38), c(0.75, 0.2, 0.75)),
              seg(c(0.42, 0.48, 0.54), c(0.3, 0.7, 0.4), c(0.48, 0.54, 0.6), c(0.7, 0.4, 0.8))),
    # statistics: drawn separately below (upright histogram)
    seg(0.1, 0.3, 0.6, 0.3),
    # scales: axis with ticks
    bind_rows(seg(0.1, 0.2, 0.55, 0.2),
              seg(seq(0.1, 0.55, length.out = 5), 0.2, seq(0.1, 0.55, length.out = 5), 0.32)),
    # facets: 2 x 2 panels
    bind_rows(seg(c(0.12, 0.36), 0.15, c(0.12, 0.36), 0.85),
              seg(c(0.3, 0.54), 0.15, c(0.3, 0.54), 0.85),
              seg(c(0.12, 0.12, 0.36, 0.36), c(0.15, 0.85, 0.15, 0.85),
                  c(0.3, 0.3, 0.54, 0.54), c(0.15, 0.85, 0.15, 0.85)),
              seg(c(0.12, 0.12, 0.36, 0.36), c(0.45, 0.55, 0.45, 0.55),
                  c(0.3, 0.3, 0.54, 0.54), c(0.45, 0.55, 0.45, 0.55))),
    # coordinates: a curved (polar) grid
    {th <- seq(0, pi / 2, length.out = 12)
     r <- c(0.25, 0.5)
     bind_rows(lapply(r, function(rr) seg(0.12 + rr * cos(head(th, -1)) * 0.8,
                                          0.15 + rr * sin(head(th, -1)) * 1.3,
                                          0.12 + rr * cos(th[-1]) * 0.8,
                                          0.15 + rr * sin(th[-1]) * 1.3)),
               seg(0.12, 0.15, c(0.52, 0.12, 0.40), c(0.15, 0.8, 0.61)))},
    # theme: grid lines
    seg(0.1, c(0.25, 0.5, 0.75), 0.55, c(0.25, 0.5, 0.75))
  )
}
icons <- bind_rows(lapply(layers$i, function(k) {
  s <- icon_segs(k)
  a <- tr(s$u, s$v, k); b <- tr(s$uu, s$vv, k)
  tibble(i = k, x = a$X, y = a$Y, xend = b$X, yend = b$Y)
})) |>
  left_join(select(layers, i, now), by = "i")

# statistics: an upright histogram standing on the slab
hist_base <- tr(seq(0.16, 0.52, length.out = 7), 0.3, 3)
hist_df <- tibble(x = hist_base$X, y = hist_base$Y,
                  yend = hist_base$Y + c(0.12, 0.3, 0.55, 0.62, 0.42, 0.22, 0.1))
# geometries also get two points; scales a colour bar; aesthetics arrowheads
geom_pts <- tr(c(0.14, 0.2), c(0.35, 0.65), 2)
bar_tiles <- tibble(u = seq(0.62, 0.86, length.out = 5)) |>
  mutate(t = row_number()) |>
  rowwise() |>
  reframe(t = t, tr(u + c(0, 0.05, 0.05, 0), c(0.3, 0.3, 0.7, 0.7), 4))
aes_tips <- tr(0.45, c(0.25, 0.5, 0.75), 1)
aes_tails <- tr(0.12, c(0.25, 0.5, 0.75), 1)

blue_fill <- "#D6E6F4"; blue_edge <- oi[["blue"]]
grey_fill <- "#F1F1F1"; grey_edge <- "#B5B5B5"

tx <- x0 + W + D + 0.45
p_layers <- ggplot() +
  geom_polygon(data = slab_poly, aes(X, Y, group = i,
                                     fill = ifelse(now, blue_fill, grey_fill),
                                     colour = ifelse(now, blue_edge, grey_edge)),
               linewidth = 0.9, alpha = 0.96) +
  geom_segment(data = icons, aes(x, y, xend = xend, yend = yend,
                                 colour = ifelse(now, blue_edge, grey_edge)),
               linewidth = 0.9, lineend = "round") +
  geom_segment(data = tibble(x = aes_tails$X, y = aes_tails$Y,
                             xend = aes_tips$X, yend = aes_tips$Y),
               aes(x, y, xend = xend, yend = yend), colour = blue_edge,
               linewidth = 0.9, arrow = arrow(length = unit(5, "pt"),
                                              type = "closed")) +
  geom_segment(data = hist_df, aes(x, y, xend = x, yend = yend),
               colour = blue_edge, linewidth = 4.2) +
  geom_point(data = geom_pts, aes(X, Y), colour = blue_edge, size = 2.6) +
  geom_polygon(data = bar_tiles, aes(X, Y, group = t,
                                     fill = c("#EEEEEE", "#D2D2D2", "#B5B5B5",
                                              "#999999", "#7C7C7C")[t]),
               colour = NA) +
  # labels to the right
  geom_text(data = layers, aes(tx, i * gap + H / 2 + 0.13, label = name,
                               colour = ifelse(now, blue_edge, "#777777")),
            hjust = 0, family = fam, fontface = "bold", size = 6.2) +
  geom_text(data = layers, aes(tx + 2.05, i * gap + H / 2 + 0.13, label = code,
                               colour = ifelse(now, ink, "#777777")),
            hjust = 0, family = mono, size = 4.4) +
  geom_text(data = layers, aes(tx, i * gap + H / 2 - 0.2, label = desc),
            hjust = 0, family = fam, size = 4.2, colour = muted) +
  geom_label(data = layers, aes(17.3, i * gap + H / 2, label = when,
                                fill = ifelse(now, blue_edge, "#9A9A9A")),
             hjust = 1, family = fam, fontface = "bold", size = 3.9,
             colour = "white", linewidth = 0,
             label.padding = unit(0.3, "lines")) +
  # bracket: what every chart needs
  annotate("segment", x = 0.95, xend = 0.95, y = 0.05, yend = 2 * gap + H - 0.05,
           colour = ink, linewidth = 0.8) +
  annotate("segment", x = 0.95, xend = 1.12, y = c(0.05, 2 * gap + H - 0.05),
           yend = c(0.05, 2 * gap + H - 0.05), colour = ink, linewidth = 0.8) +
  annotate("text", x = 0.5, y = (2 * gap + H) / 2,
           label = "every chart\nneeds these", angle = 90, family = fam,
           size = 4.3, colour = ink, lineheight = 0.9) +
  annotate("segment", x = 0.95, xend = 0.95, y = 3 * gap + 0.05,
           yend = 7 * gap + H - 0.05, colour = "#999999", linewidth = 0.8,
           linetype = "22") +
  annotate("text", x = 0.6, y = (3 * gap + 7 * gap + H) / 2,
           label = "sensible defaults until you change them", angle = 90,
           family = fam, size = 4.3, colour = muted) +
  scale_fill_identity() +
  scale_colour_identity() +
  coord_fixed(xlim = c(0, 17.4), ylim = c(-0.15, 7 * gap + H + 0.15),
              expand = FALSE) +
  theme_void()

save_png(p_layers, "ggplot-layers.png", 2200, 1180)
cat("wrote ggplot-layers.png\n")
