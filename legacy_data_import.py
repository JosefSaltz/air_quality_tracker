import numpy as np
import pandas as pd
from dotenv import dotenv_values
from supabase import create_client, Client
from shapely.wkt import dumps
from shapely.geometry import Point
# Parse the local dotenv file
devENV = dotenv_values(".env.local")
# Grab our Supabase keys
url = devENV["PUBLIC_LOCAL_SUPABASE_URL"]
key = devENV["PRIVATE_SUPABASE_SERVICE_ROLE"]
# Assert that we have our env variables
assert isinstance(key, str) and key
assert isinstance(url, str) and url
# Convert Geo Coordinates to a Location Text Data
def convert_to_wkt(lat, lon):
  point = Point(lon, lat)  # Note: (longitude, latitude) order
  return dumps(point)
# Instantiate Client
supabase: Client = create_client(url, key)
# Select ther UID to use for the insert
user_id = devENV["SOME_USER_UID"]
# Have pandas parse the excel doc
odor_table = pd.read_excel("edited_odor_log.xlsx", engine="openpyxl")
# Debug, check the table
print(odor_table)
# Iterate over rows and insert to DB
for index, row in odor_table.iterrows():
  lat, lon = row["Lat"], row["Lon"]
  location = convert_to_wkt(lat, lon)
  # Structure the payload and nullify NaN values
  report_data = {
    "created_at": row["ISO DATE"] if pd.notna(row["ISO DATE"]) else None,
    "latitude": lat if np.isfinite(lat) else None,
    "longitude": lon if np.isfinite(lon) else None,
    "location": location,
    "created_by": user_id,
    "strength": row["Strength"],
    "wind_direction": row["Wind Deg"] if np.isfinite(row["Wind Deg"]) else None,
    "wind_speed_kn": row["WIND Speed"] if np.isfinite(row["WIND Speed"]) else None,
    "temperature_f": row["WEATHER"] if np.isfinite(row["WEATHER"]) else None,
    "description": row["COMMENT"] if pd.notna(row["COMMENT"]) else None
  }
  # Debugging: Print the row before inserting
  print(f"Inserting row {index}: {report_data}")
  # Execute Insert Operation
  supabase.table("reports").insert(report_data).execute()