
module bounty_hunter::human {

    use bounty_hunter::spirit;
    use bounty_hunter::action;

    friend bounty_hunter::battle;

    struct Human has store, drop {
        base: spirit::Spirit,
    }

    // PUBLIC FRIEND FUNCTIONS //   

    public(friend) fun create(hp : u64, mp : u64 , atk : u64): Human {
        let sp = spirit::create(hp, mp, atk);
        let human = Human { 
            base: sp,
        };
        human 
    }

    public(friend) fun get_attack_action(human: &Human): action::Action {
        let atk = spirit::attack_value(&human.base);
        action::create(atk, 1, false)
    }

    public(friend) fun attacked (human: &mut Human, act: &action::Action) : bool {
        let value = action::get_value(act);
        let dead = spirit::damage(&mut human.base, value);
        dead
    }

    public(friend) fun get_counter_attack_action (human: &Human) : action::Action{
        let atk = spirit::attack_value(&human.base);
        action::create(atk, 1, true)
    }

    // PRIVATE FUNCTIONS //
}