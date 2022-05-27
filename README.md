# 👻 Aavegotchi Waatcher (wip)

A work in progress Aavegotchi CLI explorer.

*Waatcher* is consuming data from the Aavegotchi Core Matic Subgraph.


## Setup
This project is using NPM and NodeJS.

You can run *waatcher* from the Node project:
```bash
git clone https://github.com/NaviNavu/aavegotchi-waatcher.git
cd aavegotchi-waatcher/
npm install
node bin/index.js [command]
```

Or you can install *waatcher* globally on your system by using the provided NPM script:
```bash
git clone https://github.com/NaviNavu/aavegotchi-waatcher.git
cd aavegotchi-waatcher/
npm run waatcher-install
```

Then run *waatcher* from anywhere:
```bash
waatcher [command]
```

To uninstall *waatcher*:
```bash
npm uninstall -g waatcher
```


## Commands

#### 👀 waatch | w

Waatch for new Baazaar listings or lendings with live update.

###### Subcommands (mandatory)

```bash
baazaar|b [options]
lendings|l [options] (NOT IMPLEMENTED)
```

###### Examples

- Waatch for last Baazaar listings (mixed):
```bash
waatcher waatch baazaar
waatcher w b
```
![wb](https://user-images.githubusercontent.com/77575346/170732647-2ad80c1f-6b4d-4de0-94b2-b284eea1f9a9.png)


- Waatch for last Baazaar listings filtered by a given category:

```bash
waatcher waatch baazaar -c gotchi
waatcher w b -c gotchi
```
![wbc](https://user-images.githubusercontent.com/77575346/170733030-0814841e-40db-4de9-8b58-5ca2a281cbc9.png)

Available categories: gotchi, portalclose, portalopen, parcel, wearable, consumable, badge, ticket, building, tile

- Or by a given token ID:
```bash
waatcher waatch baazaar -c gotchi -i 2898
waatcher w b -c gotchi -i2898
```

![wbci](https://user-images.githubusercontent.com/77575346/170733182-a7e14117-a4b7-486b-9997-c43e9b631dc0.png)

#### 👻 summon | s

Display details about an Aavegotchi asset. *(Gotchis only! Other assets coming soon)*
```bash
waatcher summon -c gotchi -i 2898
waatcher s -c gotchi -i2898
```

![sci](https://user-images.githubusercontent.com/77575346/170733275-f01f39ba-8fbf-44ef-abc5-ba08ae973d7a.png)

#### 📊 staats
Display Aavegotchi statistics.

```bash
waatcher staats
```

## What's next?
- Waatch lendings implementation
- All Aavegotchi assets details
- Better global UI
- Better statistics


