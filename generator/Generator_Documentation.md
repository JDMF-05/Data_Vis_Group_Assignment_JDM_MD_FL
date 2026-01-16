SUPSI 2024-25  
Data Visualization course, C-D3202E 
Teacher Giovanni Profeta


# What Makes Music Change?
Authors: [Joshua David Moshi](https://github.com/JDMF-05), [Federico Lombardo](https://github.com/2vinaa), [Mattia Dellamonica](https://github.com/MDellam)

[What Makes Music Change?](https://visualization.cargo.site/)


## Artist – Poster Generator

[Artist – Poster Generator](https://jdmf-05.github.io/Data_Vis_Group_Assignment_JDM_MD_FL/generator/)

### Description

The Artist Poster Generator is an interactive web based tool that allows users to create a custom visual poster for a selected music artist. By entering an artist’s name, the generator produces a high-resolution image displaying the artist’s five most popular songs, ranked according to historical chart performance data.

The generator is entirely client-side and designed to be lightweight, fast, and easily accessible through a standard web browser, without requiring user authentication or server-side processing.

### How it works

The generation process follows a structured pipeline that transforms user input into a finalized visual artifact.
```md
Artist name input 
    |
    v
Autocomplete & fuzzy matching  
    |
    v
Artist resolution  
    |
    v
Top 5 song selection
    |
    v
Poster template selection 
    |
    v
Canvas rendering  
    |
    v
Preview & download  
```

Each step is handled in real time within the browser.

### Artist search and selection

To improve usability and prevent input errors, the generator implements an autocomplete system combined with fuzzy text matching. Artist names are normalized by removing accents, punctuation, and case differences before comparison.

Search results prioritize prefix matches while also supporting approximate matches through a fuzzy matching algorithm. This ensures reliable artist selection even with partial or imperfect input.

### Data usage

The generator retrieves song ranking data from a preprocessed Google Sheet accessed through the OpenSheet API. For each artist, songs are ranked using an aggregated popularity score, and the five highest-ranking tracks are selected for poster generation.

A separate text file containing unique artist names is used exclusively to build the search index.

### Poster rendering

The visual poster is generated using the HTML5 Canvas API. A background template is randomly selected from a predefined set to introduce visual variation.

The artist’s name is rendered at the top of the poster using a dynamically resized font to ensure it fits within layout constraints. Each of the five selected songs is displayed in a fixed row, including the song title, number of chart appearances, best chart position, and date of peak ranking.

Text truncation and clipping are applied to maintain visual consistency across different name lengths and screen sizes.

### Preview, modal, and download

After rendering, a scaled-down preview of the poster is displayed in the interface. Users can click the preview to open a full-resolution version in a modal window.

The final poster can be downloaded as a PNG image using a client-side export of the canvas, requiring no additional processing or external services.

### Interaction details

The interface includes a reset mechanism to clear the current state and generate a new poster. Additionally, a small set of hidden Easter eggs is implemented, triggering alternative visual content when specific artist names are entered. These features are isolated from the main generation logic and do not affect standard functionality.

### Limitations

The generator relies on historical chart data and does not reflect real-timestreaming popularity. Visual templates are predefined and do not adapt to genre-specific aesthetics.

