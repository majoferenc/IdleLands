
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { find, pull, sumBy } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { Item } from '../Item';
import { ItemSlot, TeleportItemLocation, IBuffScrollItem, IBuff, GuildResource } from '../../interfaces';
import { Player } from './Player.entity';

@Entity()
export class Inventory extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private equipment: { [key in ItemSlot]?: Item };

  @Column()
  private items: Item[];

  @Column()
  private size: number;

  @Column()
  private teleportScrolls: { [key in TeleportItemLocation]?: number };

  @Column()
  private buffScrolls: IBuffScrollItem[];

  @Column()
  private resources: { astralium: number, wood: number, clay: number, stone: number };

  public get $inventoryData() {
    return {
      equipment: this.equipment,
      items: this.items,
      size: this.size,
      teleportScrolls: this.teleportScrolls,
      buffScrolls: this.buffScrolls,
      resources: this.resources
    };
  }

  constructor() {
    super();
    if(!this.equipment) this.equipment = { };
    if(!this.items) this.items = [];
    if(!this.teleportScrolls) this.teleportScrolls = { };
    if(!this.buffScrolls) this.buffScrolls = [];
    if(!this.resources) {
      this.resources = {
        [GuildResource.Astralium]: 0,
        [GuildResource.Wood]: 0,
        [GuildResource.Clay]: 0,
        [GuildResource.Stone]: 0
      };
    }
  }

  // basic functions
  private calcSize(player: Player): number {
    return player.$statistics.get('Game/Premium/Upgrade/InventorySize');
  }

  public init(player: Player): void {
    this.updateSize(player);

    this.items = this.items.map(item => {
      const itemRef = new Item();
      itemRef.init(item);
      return itemRef;
    });

    Object.keys(this.equipment).forEach(itemSlot => {
      if(!this.equipment[itemSlot] || !this.equipment[itemSlot].name) {
        this.equipment[itemSlot] = null;
        return;
      }

      const itemRef = new Item();
      itemRef.init(this.equipment[itemSlot]);
      this.equipment[itemSlot] = itemRef;
    });

    this.buffScrolls = this.buffScrolls.filter(x => x.expiresAt > Date.now());
  }

  public updateSize(player) {
    this.size = this.calcSize(player);
  }

  public isNeedingNewbieItems(): boolean {
    return Object.keys(this.equipment).length === 0;
  }

  public totalItemScore(): number {
    return sumBy(Object.values(this.equipment), item => item ? item.score : 0);
  }

  // equipment-related functions
  public itemInEquipmentSlot(slot: ItemSlot): Item {
    return this.equipment[slot];
  }

  public equipItem(item: Item): void {
    if(!item) return;
    if(!item.type) throw new Error(`Item ${JSON.stringify(item)} has no type so it cannot be equipped.`);

    this.equipment = this.equipment || { };
    this.equipment[item.type] = item;
  }

  public unequipItem(item: Item): void {
    if(!item) return;

    const itemExisting = this.itemInEquipmentSlot(item.type);
    if(item !== itemExisting) throw new Error(`Could not unequip ${item.name} since it is not equipped.`);

    this.equipment[item.type] = null;
  }

  // inventory-related functions
  public canAddItemsToInventory(): boolean {
    return this.items.length < this.size;
  }

  public addItemToInventory(item: Item): void {
    if(!this.canAddItemsToInventory()) return;

    this.items = this.items || [];
    this.items.push(item);
  }

  public removeItemFromInventory(...items: Item[]): void {
    pull(this.items, ...items);
  }

  public getItemFromInventory(itemId: string): Item {
    return find(this.items, { id: itemId });
  }

  public itemsFromInventory(): Item[] {
    return this.items;
  }

  public unlockedItems(): Item[] {
    return this.items.filter(item => !item.locked);
  }

  public clearInventory(): void {
    this.items = [];
  }

  public addTeleportScroll(scroll: TeleportItemLocation): void {
    this.teleportScrolls[scroll] = this.teleportScrolls[scroll] || 0;
    this.teleportScrolls[scroll]++;
  }

  public useTeleportScroll(player: Player, scroll: TeleportItemLocation): boolean {
    if(this.teleportScrolls[scroll] <= 0 || player.region === scroll) return false;

    player.$$game.movementHelper.doTeleport(player, { toLoc: scroll });
    player.increaseStatistic('Item/Use/TeleportScroll', 1);

    this.teleportScrolls[scroll]--;
    return true;
  }

  public addBuffScroll(scroll: IBuffScrollItem): void {
    this.buffScrolls.push(scroll);
  }

  public useBuffScroll(player: Player, scrollId: string): boolean {
    const scroll = find(this.buffScrolls, { id: scrollId });
    if(!scroll || scroll.expiresAt < Date.now()) return false;

    player.addBuff({
      booster: true,
      name: scroll.name,
      statistic: 'Character/Ticks',
      duration: Math.max(720, (720 * player.$statistics.get('Game/Premium/Upgrade/BuffScrollDuration'))), // 1 hour per stat,
      stats: scroll.stats
    });

    player.increaseStatistic('Item/Use/BuffScroll', 1);

    pull(this.buffScrolls, scroll);

    return true;
  }

  public addResources(
    opts: {
      [GuildResource.Wood]?: number,
      [GuildResource.Clay]?: number,
      [GuildResource.Stone]?: number,
      [GuildResource.Astralium]?: number
    } = {
      [GuildResource.Wood]: 0,
      [GuildResource.Clay]: 0,
      [GuildResource.Stone]: 0,
      [GuildResource.Astralium]: 0
    }
  ) {
    if(opts[GuildResource.Wood]) this.resources[GuildResource.Wood] += opts[GuildResource.Wood];
    if(opts[GuildResource.Clay]) this.resources[GuildResource.Clay] += opts[GuildResource.Clay];
    if(opts[GuildResource.Stone]) this.resources[GuildResource.Stone] += opts[GuildResource.Stone];
    if(opts[GuildResource.Astralium]) this.resources[GuildResource.Astralium] += opts[GuildResource.Astralium];
  }

  public hasResource(res: GuildResource, amount: number): boolean {
    return this.resources[res] >= amount;
  }

  public spendResource(res: GuildResource, amount: number) {
    this.resources[res] -= amount;
  }
}
