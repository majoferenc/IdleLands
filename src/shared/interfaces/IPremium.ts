import { Profession } from './IPlayer';

export enum PermanentUpgrade {

  // the permanent inventory size boost for buying this pet
  InventorySizeBoost = 'inventorySizeBoost',

  // the permanent soul storage size boost for buying this pet
  BuffScrollDuration = 'buffScrollDurationBoost',

  // the permanent adventure log size boost for buying this pet
  AdventureLogSizeBoost = 'adventureLogSizeBoost',

  // the permanent choice log size boost for buying this pet
  ChoiceLogSizeBoost = 'choiceLogSizeBoost',

  // the permanent enchant cap boost for buying this pet
  EnchantCapBoost = 'enchantCapBoost',

  // the permanent item stat cap % boost for buying this pet
  ItemStatCapBoost = 'itemStatCapBoost',

  // the permanent item stat cap % boost for buying this pet
  PetMissionCapBoost = 'petMissionCapBoost',

  // the permanent injury threshold for being locked out of combat
  InjuryThreshold = 'injuryThreshold',

  // the number of pets you can bring into combat
  MaxPetsInCombat = 'maxPetsInCombat',

  // the maximum stamina boost you get. stacks with other sources.
  MaxStaminaBoost = 'maxStaminaBoost'
}

export enum PremiumTier {
  None = 0,
  Donator = 1,
  Subscriber = 2,
  Subscriber2 = 3,
  Subscriber3 = 4,
  Moderator = 5,
  GM = 10
}

export enum ContributorTier {
  None = 0,
  Contributor = 2
}

export const PremiumScale = {
  [PermanentUpgrade.AdventureLogSizeBoost]: 3,
  [PermanentUpgrade.ChoiceLogSizeBoost]: 5,
  [PermanentUpgrade.EnchantCapBoost]: 15,
  [PermanentUpgrade.InventorySizeBoost]: 20,
  [PermanentUpgrade.BuffScrollDuration]: 10,
  [PermanentUpgrade.ItemStatCapBoost]: 25,
  [PermanentUpgrade.PetMissionCapBoost]: 50,
  [PermanentUpgrade.MaxStaminaBoost]: 2
};

export enum OtherILPPurchase {
  ResetCooldowns = 'resetCooldowns'
}

export const OtherILPCosts: { [key in OtherILPPurchase]: number } = {
  [OtherILPPurchase.ResetCooldowns]: 50
};

export const GoldGenderCost: { [key in Profession]: number } = {
  [Profession.Archer]: 500_000_000,
  [Profession.Barbarian]: 50_000_000,
  [Profession.Bard]: 25_000_000,
  [Profession.Bitomancer]: 25_000_000,
  [Profession.Cleric]: 10_000_000,
  [Profession.Fighter]: 10_000_000,
  [Profession.Generalist]: 10_000_000,
  [Profession.Jester]: 1_000_000_000,
  [Profession.Mage]: 10_000_000,
  [Profession.MagicalMonster]: 100_000_000,
  [Profession.Monster]: 100_000_000,
  [Profession.Necromancer]: 500_000_000,
  [Profession.Pirate]: 50_000_000,
  [Profession.Rogue]: 25_000_000,
  [Profession.SandwichArtist]: 1_000_000
};
