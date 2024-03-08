// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This example demonstrates a basic use of a shared object.
/// Rules:
/// - anyone can create and share a counter
/// - everyone can increment a counter by 1
/// - the player of the counter can reset it to any value
module bounty_hunter::battle {

    use std::string;
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};

    use bounty_hunter::human;

    struct Battle has key, store {
        id : UID,
        player: human::Human,
        fugitive : human::Human,
    }

    struct BattleActionEvent has copy, drop{
        from : string::String,
        to : string::String,
        desc : string::String,
        action: u64,
        health: u64,
    }

    public entry fun create(ctx: &mut TxContext) {
        let player = human::create(100,100,30);
        let fugitive = human::create(100,100,15);
        let battle = Battle {
            id : object::new(ctx),
            player: player,
            fugitive: fugitive,
        };
        let sender = tx_context::sender(ctx);
        transfer::transfer(battle, sender);
    }

    public entry fun burn(game: Battle)  {
        let Battle {  
            id,
            player: _,
            fugitive: _,
        } = game;
        object::delete(id);
    }

    public entry fun action(battle: &mut Battle, _: u64) : bool{
        // player's turn
        let atk_act = human::get_attack_action(&battle.player);
        let dead = human::attacked(&mut battle.fugitive, &atk_act);
        if (dead) {
            return true
        };
        // fugitive's fight back
        let counter_attack = human::get_counter_attack_action(&battle.fugitive);
        dead = human::attacked(&mut battle.player, &counter_attack);
        if (dead) {
            return true
        };
        return false
    }
}
