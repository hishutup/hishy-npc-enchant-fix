/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'NPC Enchant Fix'
    },
    requiredFiles: [],
    getFilesToPatch: function(filenames) {
        return filenames;
    },
    execute: {
        initialize: function(patch, helpers, settings, locals) {
            locals.perkData = [{
                Name:'AlchemySkillBoosts',
                Rank: '1',
                FormID:''
            },{
                Name:'PerkSkillBoosts',
                Rank: '1',
                FormID:''
            }];

            helpers.loadRecords('PERK', false).forEach(function(perk) {
                locals.perkData.forEach(function(key) {
                    if (key.Name == xelib.EditorID(perk)) {
                        key.FormID = xelib.GetHexFormID(perk, false, false);
                    }
                });
            });
        },
        process: [{
            load: function(plugin, helpers, settings, locals) {
                return {
                    signature: 'NPC_',
                    filter: function(record) {
                        return !xelib.GetFlag(record, 'ACBS\\Template Flags', 'Use Spell List');
                    }
                }
            },
            patch: function(record, helpers, settings, locals) {
                if (!xelib.HasElement(record, 'Perks')) {
                    xelib.AddElement(record, 'Perks');
                    xelib.RemoveElement(record, 'Perks\\[0]');
                }

                locals.perkData.forEach(function(key) {
                    if (!xelib.HasArrayItem(record, 'Perks', 'Perk', key.Name)) {
                        let rec = xelib.AddArrayItem(record, 'Perks', 'Perk', String(key.FormID));
                        xelib.SetValue(rec, 'Rank', key.Rank);
                    }
                });
            }
        }]
    }
});