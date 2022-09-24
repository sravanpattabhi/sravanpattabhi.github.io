import pandas as pd
df_sgd = pd.read_csv('SlateGunDeaths.csv')
males = df_sgd[df_sgd['gender'] == 'M']
females = df_sgd[df_sgd['gender'] == 'F']
males_city = males.groupby(['city', 'state'])['victimID'].count().to_frame()
males_city.columns = ['males']
females_city = females.groupby(['city', 'state'])['victimID'].count().to_frame()
females_city.columns = ['females']
merged = males_city.merge(females_city, how='outer', left_on=['city', 'state'], right_index=True).reset_index()
merged = merged.fillna(0)
merged = merged.astype({'males': 'int16', 'females': 'int16'})
df_values = df_sgd[['city', 'state', 'lat', 'lng']]
df_values = df_values.drop_duplicates(subset=['city', 'state'], keep='first')
merged_2 = merged.merge(df_values, how='inner', on=['city', 'state'])
df_state_codes = pd.read_csv('us-states-postal-code.csv')
df_state_codes.columns = ['state_name', 'state']
frequency = merged_2.merge(df_state_codes, on='state')
frequency['city_state'] = frequency.apply (lambda row: row.city + ', ' + row.state_name, axis=1)
final_frequency = frequency[['city_state', 'state', 'males', 'females', 'lat', 'lng']]
final_frequency.columns = ['names', 'state', 'males', 'females', 'lat', 'lng']
final_frequency.to_csv(r'frequency2.csv')