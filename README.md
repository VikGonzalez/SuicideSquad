# Final Deployed Project is found in the following HEROKU APP: https://suicide-analysis-project.herokuapp.com/ #

The purpose of this project is to present global suicide data collected by the WHO from 78 different countries spanning from 1987 to 2014. We want to analyze geographic, socioeconomic, and psychological trends. 

While the suicide death rate is declining overall around the globe by 26%, suicide has been growing in Mexico during the last decade or so (a 16.6% increase between 2000 and 2012). This increase is more noticeable among Mexican women (with a 55.1% increase vs. the 10.0% increase in males) with impact most noticeable in the youth (10-19 years old) and adult women between 30 and 49 years of age.

# Website
Here’s a breakdown of our website’s tabular organization:
**Global Map** -  Leaflet.js map showing suicide rate (# of suicides/100,000 people) of different countries, overlayed on GDP or population of each country.

**Global Graphic** – D3.js traces for user selected country of suicide rates throughout the years (1985 to 2015, if data is available). Traces are color coded by age group and either male or female traces can be selected. Right below is a Plotly.js bubble chart correlating suicide rates, GDP per capita and happiness indices. User can select a country to see how it compares to top 12 and least 12 happiest nations in the world.

**Global Slider** – Plotly.js time lapse of how relationship between GDP per capita and life expectancy has changed over time for the different regions of the world. Bubble sizes are proportional to the nation’s population size.

**Mexico Analysis**
**Suicide Rates in Mexico** – a Tableau hexa-map, heat map of Mexico providing age-standardized suicide rates in different parts of the country. User can select each Mexican state to view data and can select a specific year to see the age-group breakdown of how suicides are impacting different groups. The graph below provides a longitudinal look at suicide rates at the state level. The heatmap shows suicide rates per gender, per age group, per year for any given Mexican state. A particular column in the heatmap is further magnified with the butterfly chart on the right. User can select a specific year to focus on. 

**“Unemployment & Obesity” + “Divorces, Alcohol & Migration”** – Tableau views of other negative indicators that could contribute to the impact of suicide in Mexico. These indicators are used in the machine learning portion of this project

# Machine Learning (link)

Approach:
![Implementation](/resources/Images/images/implement_shot.png)

Summary of Results:
![Summary](/resources/Images/images/results_shot.png)
