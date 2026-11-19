# Builds data/dubois/property_by_county_SYNTHETIC.csv: an invented, county-level
# "tax digest" for teaching. Only the state totals per year and kind are real
# (Du Bois's plates 18, 21, 22 and 25, as transcribed by Anthony Starks); the
# split into counties and detailed categories is random. Run from the book root.
library(tidyverse)
set.seed(1900)

years <- c(1875, 1880, 1885, 1890, 1895, 1899)
real <- tibble(
  year      = years,
  total     = c(5393885, 5764293, 8153390, 12322003, 12941230, 13447423),
  land      = c(1263902, 1522173, 2362889, 3485176, 4158960, 4220120),
  town      = c(1200000, 1200000, 2000000, 3400000, 4300000, 4300000),
  furniture = c(21186, 498532, 736170, 1173624, 1322694, 1434975)
) |> mutate(other = total - land - town - furniture)

categories <- tribble(
  ~kind,       ~category,                         ~weight,
  "land",      "Farm land",                        0.75,
  "land",      "Woodland",                         0.25,
  "town",      "Town lots",                        0.55,
  "town",      "City property",                    0.45,
  "furniture", "Household furniture",              0.70,
  "furniture", "Kitchen furniture",                0.30,
  "other",     "Horses and mules",                 0.34,
  "other",     "Cattle and hogs",                  0.16,
  "other",     "Plantation and mechanical tools",  0.12,
  "other",     "Money and solvent debts",          0.14,
  "other",     "Merchandise",                      0.08,
  "other",     "All other property",               0.16
)

counties <- sprintf("County %02d", 1:40)
county_size <- rgamma(40, shape = 1.5)

# split an integer total into integer parts in proportion to w (largest remainder)
split_int <- function(total, w) {
  raw <- total * w / sum(w)
  out <- floor(raw)
  short <- total - sum(out)
  if (short > 0) {
    idx <- order(raw - out, decreasing = TRUE)[1:short]
    out[idx] <- out[idx] + 1
  }
  out
}

long <- real |>
  pivot_longer(c(land, town, furniture, other), names_to = "kind", values_to = "kind_total") |>
  select(year, kind, kind_total) |>
  left_join(categories, by = "kind", relationship = "many-to-many") |>
  group_by(year, kind) |>
  mutate(w = weight * exp(rnorm(n(), 0, 0.1)),
         cat_total = split_int(first(kind_total), w)) |>
  ungroup() |>
  select(year, kind, category, cat_total) |>
  rowwise() |>
  mutate(county = list(counties),
         value = list(split_int(cat_total, county_size * exp(rnorm(40, 0, 0.3))))) |>
  unnest(c(county, value)) |>
  ungroup()

# a few returns are missing: blank, or "n.r." (not returned). Their value is moved
# to another county, so the state totals stay exactly the same as Du Bois's.
miss <- sample(nrow(long), 40)
for (i in miss) {
  r <- long[i, ]
  j <- which(long$year == r$year & long$category == r$category & !(seq_len(nrow(long)) %in% miss))[1]
  long$value[j] <- long$value[j] + r$value
}
long$value_text <- str_c("$", format(long$value, big.mark = ",", trim = TRUE))
long$value_text[miss] <- if_else(runif(length(miss)) < 0.5, "", "n.r.")

wide <- long |>
  select(county, category, year, value_text) |>
  pivot_wider(names_from = year, values_from = value_text) |>
  arrange(county, category)

# messy category names, as if typed by different clerks
n <- nrow(wide)
r <- runif(n)
wide$category <- case_when(
  r < 0.08 ~ str_to_upper(wide$category),
  r < 0.14 ~ str_to_lower(wide$category),
  r < 0.19 ~ str_c(wide$category, " "),
  TRUE ~ wide$category
)
typo <- which(str_detect(wide$category, regex("^household furniture", ignore_case = TRUE)))
wide$category[sample(typo, 6)] <- "Houshold furniture"

wide <- wide |> mutate(note = "SYNTHETIC: invented for teaching, not historical data", .after = county)
write_csv(wide, "data/dubois/property_by_county_SYNTHETIC.csv", na = "")
