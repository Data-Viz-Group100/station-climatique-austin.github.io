#################Fallou DIENG###########################################
import  numpy as np
import  pandas as pd
import warnings
import matplotlib.pyplot as plt
warnings.filterwarnings('ignore')

#########################################################################
###################Cration des fonction utiles ##########################
#########################################################################

#Charger les données
def upload(file):
    data = pd.read_csv(file, sep=",")
    Clean_data = data.ix[:, 0:20].replace('-', np.NAN)
    # Supprimer les lignes contenant des données manquantes
    Clean_data.dropna(inplace=True)
    return   Clean_data

#Calculer la corrélation entre les variables
def correlation(data):
    colonnes = ["TempAvgF","DewPointAvgF","HumidityAvgPercent","SeaLevelPressureAvgInches","VisibilityAvgMiles","WindAvgMPH"]
    dflis = list()
    data = data[colonnes].astype(float)
    for i in range(len(colonnes)-1):
        for j in range(i+1, len(colonnes)):
            corr =  data[colonnes[i]].corr(data[colonnes[j]])
           # print(colonnes[i]+"  "+colonnes[j] +"  "+str(corr))
            dflis.append((colonnes[i],colonnes[j] ,corr*10))
    df = pd.DataFrame(dflis,  columns=["source","target","value"])
    return  df

def matrixcorr(data):
    colonnes = data.columns.tolist()
    matrix = list()
    for i in range(len(colonnes)):
        corri = list()
        for j in range(len(colonnes)):
            corr = data[colonnes[i]].corr(data[colonnes[j]])
            corri.append(corr)
        matrix.append(corri)
    return  matrix
# Sauvegarder la matrice de corrélation entre les variable
def Savedata(df, folder, file):
    filename = folder+"/"+file+".json"
    df.to_json(filename, orient='records')


def ousam(data):
    oussama = []
    temp = data["TempAvgF"].values.tolist()
    humidite = data["HumidityAvgPercent"].values.tolist()
    date = pd.DatetimeIndex(data["Date"].values.tolist())
    year = date.year.tolist()
    month = date.month.tolist()
    for i in range(len(month)):
        oussama.append((year[i],month[i],temp[i],humidite[i]))
    df = pd.DataFrame(oussama, columns=["year", "month", "temperature","humidite"])
    df1 = df[["year", "month"]].drop_duplicates().astype(int)
    df2 = df[["year", "month", "temperature", "humidite"]].groupby(["year", "month"]).agg("mean")
    df3 =np.concatenate((df1,df2),axis=1)
    df3 = pd.DataFrame(df3.tolist(), columns=["year", "month", "temperature", "humidite"])
    df3["year"] = df3["year"].astype(int)
    df3["month"] = df3["month"].astype(int)
    return  df3
###################################################################
#####################Appel des fonction~###########################
###################################################################
data = upload("../data/austin_weather.csv")
df = ousam(data)

print(df)
Savedata(df,"../data", "oussama")
#data=data[['TempHighF', 'TempAvgF', 'TempLowF', 'DewPointHighF','DewPointAvgF', 'DewPointLowF', 'HumidityHighPercent',
         #   'HumidityAvgPercent', 'HumidityLowPercent','SeaLevelPressureHighInches', 'SeaLevelPressureAvgInches','SeaLevelPressureLowInches',
         #  'VisibilityHighMiles', 'VisibilityAvgMiles', 'VisibilityLowMiles', 'WindHighMPH', 'WindAvgMPH','WindGustMPH']]

#matrix = matrixcorr(data)
#print(matrix)


#data.to_json("../data/data.json", orient='split')
#df = correlation(data)
#print(data.columns)
#Savedata(df,"../data", "corr2")


################F04##############################################
            # DU BIEN, BU BEAU ET DE L"INNOVATION
##################################################################