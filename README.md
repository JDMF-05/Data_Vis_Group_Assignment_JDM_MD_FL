SUPSI 2024-25  
Data Visualization course, C-D3202E 
Teacher Giovanni Profeta


# What Makes Music Change?
Authors: [Joshua David Moshi](https://github.com/JDMF-05), [Federico Lombardo](https://github.com/2vinaa), [Mattia Dellamonica](https://github.com/MDellam)

[What Makes Music Change?](https://visualization.cargo.site/)


## Abstract

This project analyzes trends in U.S. popular music using historical *Billboard Hot 100* data from 1960 to 2025. By combining a point-based popularity metric with genre and macrogenre classification, the study explores how musical styles, seasonality, and artist presence have evolved over time. The resulting insights provide a concise overview of long-term changes in the musical landscape.



## Introduction
The main objective of this project is to analyze different aspects in the Musical Landscape. Our goals are to not only understand which genres dominate accross the U.S but also try to find a listening trend based on various aspects in order to be able to improve marketing strategies, playlist curation and artist promotion.

In order to understand this project it is required to have a moderate understanding of the musical markets and to be comfortable with reading charts, graphs and maps.

We want this project to used to better develop targeted campaigns or strategic recommendations for record labels or simply by music enjoyers to get a better feel for the landscape.

Popularity is ranked using a Point-Based System in order to calculate the variable “Value” that is used in all of our graphs. A songs “Value” is the sum of the points based on its weekly chart position. When the song achieves the rank No. 1 it gains 100 points, No.2 gains 99 points and so on. streaming companies.

## Data sources
Name of the original dataset:
Billboard Hot 100

Compilation source:
Community-Compiled Archive

Primary data sources:
billboard.com (official source), kaggle.com, and  data.world 
(for historical dataset)

Time coverage:
This dataset spans over six decades, from 1958, 
up to most recent published date of November 22, 2025.


[Main datasource (Billboard)](https://www.billboard.com/)

## Data pre-processing
The original Billboard Hot 100 dataset provides a rich historical record of chart performance but requires extensive preprocessing to be suitable for long-term, genre based analysis. 

This section documents the full pipeline used to clean, enrich and standardize the data before visualization.

### Dataset Overview

The preprocessing workflow is based on the Billboard Hot 100 dataset, compiled from multiple historical sources and covering weekly chart data from 1958 to 2025. Each row represents a song’s appearance in the Top 100 for a given week.

The raw dataset contains over 417,000 entries and includes the following variables:
| Column | Description |
|-------|-------------|
| date | Chart release date |
| title | Song title |
| performer | Artist(s) credited |
| current_week | Chart position (1–100) |
| last_week | Previous week’s position |
| peak_pos | Highest position ever reached |
| wks_on_chart | Total weeks on the chart |


While structurally complete, the dataset lacks genre information, which is essential for our analysis.

### Genre Enrichment Strategy

To be able to do genre based visualizations, a new genre column was created using a hybrid approach combining automated retrieval and manual validation.

Processing overview:
```md
Raw Billboard Dataset
    |
    v
Automated Genre Lookup (APIs)
    |
    v
Performer Normalization
    |
    v
Duplicate-Based Genre Propagation
    |
    v
Manual Completion
    |
    v
Error & Synonym Correction
    |
    v
Final Genre Assignment
```
This approach balances scalability with accuracy, ensuring consistency.

### Automated Genre Attribution

Genres were retrieved by querying multiple external APIs using combinations of song title and performer:

- Spotify  
- MusicBrainz  
- Wikipedia  
- iTunes  

Multiple APIs were required because no single service provided consistent coverage across all decades and artist formats.

Using several APIs increased genre coverage and reduced systematic bias caused by incomplete or modern databases.

### Performer Normalization

A major challenge emerged with songs credited to multiple artists (collaborations or featured performers), which often failed API matching.

Solution:
- Temporarily reduce the performer field to the primary credited artist
- Perform genre lookup
- Restore the original performer string afterward

Example: 
```md
“Uptown Funk” – Mark Ronson feat. Bruno Mars  
    |
    v
queried as “Mark Ronson”
    |
    v
genre retrieved
    |
    v
original performer restored
```

This significantly improved match rates while preserving original artist information for analysis.

### Duplicate-Based Genre Filling

Many song–artist combinations appear repeatedly across multiple weeks.

Approach: 
```md
Query each unique song–artist combination only once 
    |
    v
Propagate the retrieved genre to all matching rows
```

This reduced computational cost and API calls while maintaining internal consistency across weekly chart entries.

### Manual Genre Completion

Despite automated methods, some songs remained without a genre label.

Method:
- Export all unmatched song–artist combinations to a text file
- Manually assign genres
- Reintegrate the results into the dataset via script

Manual completion ensured full genre coverage, particularly for older, obscure, or region-specific songs.

### Error Correction & Genre Normalization

Because genres were sourced from multiple APIs, inconsistencies and misclassifications were unavoidable.

Corrections included:
- Fixing obviously incorrect genre assignments
- Removing non-musical or malformed labels
- Mapping synonymous genres to a standardized naming convention

This step reduced noise and prevented artificial genre fragmentation in later analyses.

### Macrogenre Classification

The dataset contained tens of thousands of unique genre labels, making direct analysis impractical.

To address this, genres were grouped into 19 macrogenres:

- Pop  
- Rock & Alternative  
- Metal  
- Hip-Hop & Rap  
- R&B / Soul / Funk  
- Electronic & Dance  
- Country & Americana  
- Latin & Regional Mexican  
- Folk / Acoustic / Roots  
- Jazz & Blues  
- Classical & Orchestral  
- African Contemporary & Diaspora  
- Caribbean & Afro-Caribbean  
- Asian & Middle Eastern  
- Holiday & Seasonal  
- Soundtrack & Stage  
- Experimental & Avant-Garde  
- Comedy / Novelty / Spoken Word  
- Italian Disco & Dance  

Macrogenres allow meaningful long-term comparisons while preserving stylistic diversity.

### Fuzzy Matching Algorithm

To automate macrogenre assignment, fuzzy matching algorithm was implemented.

Scoring rules:
- Exact keyword match: +4 points
- Full-word match: +3 points
- Character similarity ≥ 0.78: +2 points
- Substring match: +1 point

Example:  
“nu metal / rap metal / alternative metal”  
→ Metal (+4)  
→ Rock & Alternative (+2)  
→ Hip-Hop & Rap (+1)  
→ Final assignment: Metal

The macrogenre with the highest score was selected. If all scores were zero, the entry was labeled “Error” for manual inspection.

This approach balances precision and flexibility, allowing robust classification of complex or multigenre labels.

### Final Data Cleaning

During validation, severe inconsistencies were identified, especially in the earliest chart years.

Issues identified:
- Duplicate ranks within the same week
- Same song appearing multiple times in a single week
- Conflicting song–artist–rank combinations

These problems were concentrated in 1958–1959, reflecting lower data reliability in early chart documentation.

| Cleaning Action | Motivation |
|----------------|------------|
| Removed all rows from 1958–1959 | Error density was too high to correct reliably and would distort long-term trend analysis. |
| Removed exact duplicates | Duplicate entries inflated song and genre counts without providing additional information. |
| Resolved same-song, different-rank duplicates within a week | Billboard charts allow only one rank per song per week; conflicting entries violate chart rules. |
| Recomputed all genre and macrogenre counts | Cleaning altered dataset size and composition, requiring recalculation to maintain statistical accuracy. |


### Final Output

After preprocessing, the dataset is:
- Fully genre labeled  
- Deduplicated and validated  
- Standardized through macrogenres  
- Consistent across six decades of data  

This preprocessing pipeline ensures that all subsequent visualizations reflect actual musical trends rather than artifacts introduced by data quality issues.

## Data visualizations
### Year by Year
This Area Chart answers the question:“How does genre trend change in time?"

Our objective is to determine how music popularity, measured by Top 100 presence, has evolved from 1960 to 2025, revealing the rise and decline of various musical genres throughout the years.

[<img src="assets/images/01.png" width="800" alt="Placeholder image">]()

### Seasonal Genres (1 & 2)
#### 1
 This analysis utilizes a heatmap visualization to address two key questions regarding music consumption patterns:
 
 How do Genres vary by season? 
 
 Which are the most listened genres by season?
 
 Our primary objective is to identify seasonally reliant genres, those that exhibit a significant spike in listening activity corresponding to a specific time of year, and determine the most popular genre for each season.

[<img src="assets/images/02.png" width="800" alt="Placeholder image">]()
#### 2
 The objective is to determine if music genre preferences shift according to the season. We are analyzing a dataset comparing five genres (Comedy, Electronic, Folk, Metal, Rock) across Winter, Spring, Summer, and Fall to identify seasonal correlations.

[<img src="assets/images/03.png" width="800" alt="Placeholder image">]()
### Top Artist
 In this Animated Beeswarm we want to find the answer to the question:
 
 “What is the frequency of appearance for each  artists?”
 
 In this analysis we want to find how many times each artist has been featured on the Billboard Top 50 to see if repeated artists have increased or decreased over the years.

 [<img src="assets/images/04.png" width="800" alt="Placeholder image">]()
## Key findings
This project highlights clear long-term, seasonal, and structural trends in popular music shaped by cultural shifts and the rise of streaming platforms. Rock & Alternative dominated the charts for over three decades before declining after the late 1980s, while Hip-Hop & Rap surged post 1988 and became the defining genre of modern music, largely replacing Jazz & Blues, which evolved into more niche and fragmented forms. Electronic & Dance music shows cyclical relevance, transitioning from underground innovation in the 1990s to globally accessible EDM in the 2010s.

Seasonality plays a major role in listening behavior. Winter favors heavier and familiar genres such as Metal and Rock, Spring is led by Folk and R&B, Summer shows the greatest genre diversity with strong spikes in Electronic and Comedy/Novelty content, and Fall is dominated by Rock and Electronic. Holiday & Seasonal music predictably peaks every year, while Italian Disco & Dance exhibits isolated historical peaks but fades from relevance after 2015.

Finally, the data reveals increasing chart concentration in the streaming era. While the late 1960s showed the highest artist diversity, modern charts are dominated by fewer unique artists, with established superstars accounting for a growing share of top placements. This suggests reduced accessibility for new artists and a shift toward a more centralized, superstar-driven music landscape.

## Next steps
This project can be expanded by adding new layers of analysis that build on the existing framework. Including streaming numbers, radio airplay, and audience engagement data would make it possible to explore popularity across multiple dimensions, not just chart rankings.

The analysis could also be extended to support more detailed genre representations, such as allowing songs to belong to multiple genres or examining subgenre groupings, reflecting the increasingly hybrid nature of modern music. Adding a geographic component would enable comparisons between national trends and regional listening patterns across the United States.

Finally, more advanced techniques such as network analysis and predictive modeling could be used to study artist collaborations, genre interactions, and potential future shifts in musical trends, adding a forward-looking perspective to the project. All of these extensions would involve more complex modeling and a longer development timeline.

