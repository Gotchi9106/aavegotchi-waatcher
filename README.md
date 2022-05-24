# 👻 Aavegotchi Waatcher (wip)

A work in progress Aavegotchi CLI explorer.


## Setup
This project is using NPM and NodeJS.

You can run *waatcher* from the Node project:
```bash
git clone https://github.com/NaviNavu/aavegotchi-waatcher.git
cd aavegotchi-waatcher/
npm install
node bin/index.js [command]
```

Or you can install *waatcher* globally on your system by using the provided npm script:
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

Waatch for new Baazaar listings with live update.

###### Subcommands (mandatory)

```bash
baazaar|b [options]
```

###### Examples

- Waatch for last Baazaar listings (mixed):
```bash
waatcher waatch baazaar
waatcher w b
```

- Waatch for last Baazaar listings filtered by a given category:

```bash
waatcher waatch baazaar -c gotchi
waatcher w b -c gotchi
```

Available categories: gotchi, portalclose, portalopen, parcel, wearable, consumable, badge, ticket, building, tile

- Or by a given token ID:
```bash
waatcher waatch baazaar -c gotchi -i 2898
waatcher w b -c gotchi -i2898
````

#### 👻 summon | s

Display details about an Aavegotchi asset. *(Gotchis only, item summoning coming soon)*
```bash
waatcher summon -c gotchi -i 2898
waatcher s -c gotchi -i2898
```

#### 📊 staats
Display Aavegotchi statistics.

```bash
waatcher staats
```

