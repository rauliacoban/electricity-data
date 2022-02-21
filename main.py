from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import json

PATH = 'C:\Program Files (x86)\chromedriver.exe'
driver = webdriver.Chrome(PATH)
driver.implicitly_wait(120)
driver.get('https://www.transelectrica.ro/widget/web/tel/sen-grafic/-/SENGrafic_WAR_SENGraficportlet')

class Entry:
    def __init__(self, time, cons, avg_cons, prod, coal, gas, hydro, nuclear, wind, solar, biomass, sold):
        self.time = time
        self.cons = cons
        self.prod = prod
        self.coal = coal
        self.gas = gas
        self.hydro = hydro
        self.nuclear = nuclear
        self.wind = wind
        self.solar = solar
        self.biomass = biomass
        self.sold = sold


def get_table_data():
    table_btn = driver.find_element(By.LINK_TEXT, 'Genereaza Tabel')
    table_btn.click()
    table = driver.find_element(By.ID, 'result_table').find_element(By.TAG_NAME, 'tbody')

    #the loop is needed because there is no way of knowing when the table is done loading
    rows = []
    while True:
        #sleep(2)
        new_rows = table.find_elements(By.TAG_NAME, 'tr')
        if len(new_rows) == len(rows):
            rows = new_rows
            break
        rows = new_rows
    rows.pop(0)

    data = []
    for row in rows:
        entries = row.find_elements(By.TAG_NAME, 'div')
        entries = [entry.text for entry in entries]
        data.append(Entry(*entries))

    for row in data:
        print(json.dumps(row.__dict__))

get_table_data()
driver.quit()