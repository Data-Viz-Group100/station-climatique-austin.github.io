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



# Sauvegarder la matrice de corrélation entre les variable
def Savedata(df, folder, file):
    filename = folder+"/"+file+".json"
    df.to_json(filename, orient='records')

###################################################################
#####################Appel des fonction~###########################
###################################################################
data = upload("../data/austin_weather.csv")
df = correlation(data)
#print(data.columns)
Savedata(df,"../data", "corr2")


################F04##############################################
            # DU BIEN, BU BEAU ET DE L"INNOVATION
##################################################################