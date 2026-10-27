# Hides the chapters for classes that are more than a week away, so that
# students can only see material one week in advance.
#
# Each part in _quarto.yml whose title has a date ("Week 3 · Tue 10 Nov: ...")
# is released 7 days before that date. Chapters in unreleased parts get a
# 'draft: true' line in their front matter; with draft-mode 'gone' (set in
# _quarto.yml), Quarto then leaves them out of the sidebar, search and links,
# and writes an empty page in their place. Parts without a date ("Useful
# information", "Exam") are always visible.
#
# Run from the book's root folder, then render and push:
#   Rscript _scripts/release.R              # release as of today
#   Rscript _scripts/release.R 2026-11-03   # release as of a given date
#   Rscript _scripts/release.R all          # show everything (e.g. for checking)

library(yaml)

course_year <- 2026 # the part titles have no year
lead_days <- 7
marker <- "draft: true # set by _scripts/release.R"

arg <- commandArgs(trailingOnly = TRUE)[1]
show_all <- identical(arg, "all")
today <- if (is.na(arg) || show_all) Sys.Date() else as.Date(arg)

part_date <- function(title) {
  m <- regmatches(title, regexpr("[0-9]{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", title))
  if (length(m) == 0) return(NA)
  # %b is locale-dependent, so match the month by hand
  parts <- strsplit(m, " ")[[1]]
  month <- match(parts[2], month.abb)
  as.Date(sprintf("%d-%02d-%02d", course_year, month, as.integer(parts[1])))
}

set_draft <- function(file, draft) {
  lines <- readLines(file, warn = FALSE)
  had <- marker %in% lines
  lines <- lines[lines != marker]
  if (draft) {
    if (lines[1] != "---") stop(file, " has no front matter")
    lines <- append(lines, marker, after = 1)
  }
  if (had != draft) writeLines(lines, file)
}

config <- read_yaml("_quarto.yml")
for (entry in config$book$chapters) {
  if (!is.list(entry) || is.null(entry$part)) next
  date <- part_date(entry$part)
  release <- date - lead_days
  hidden <- !show_all && !is.na(date) && release > today
  for (file in unlist(entry$chapters)) set_draft(file, hidden)
  cat(sprintf("%-8s %-60s %s\n",
              if (hidden) "hidden" else "visible",
              entry$part,
              if (is.na(date)) "" else paste("released", format(release, "%a %d %b"))))
}
cat("\nNow run: quarto render --to html\n")
