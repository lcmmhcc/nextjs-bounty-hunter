module bounty_hunter::spirit {

    friend bounty_hunter::human;

    struct Spirit has store, drop {
        state : u8,
        maxhp : u64,
        hp: u64,
        maxmp: u64,
        mp: u64,
        atk : u64,
    }
    // PUBLIC FRIEND FUNCTIONS // 
      
    public(friend) fun create (hp :u64, mp: u64, atk: u64) : Spirit {
       Spirit {
            state: 0,
            maxhp: hp,
            hp: hp,
            maxmp: mp,
            mp: mp,
            atk: atk,
        }
    }

    public(friend) fun damage(spirit: &mut Spirit, amount: u64) : bool{
        if (amount > spirit.hp) {
            spirit.hp = 0;
            return true
        };
        spirit.hp = spirit.hp - amount;
        return false
    }

    public(friend) fun heal(spirit: &mut Spirit, amount: u64) {
        if (spirit.hp + amount > spirit.maxhp) {
            spirit.hp = spirit.maxhp;
        };
        spirit.hp = spirit.hp + amount;
    }

    public(friend) fun attack_value (spirit: &Spirit) : u64 {
        spirit.atk
    }
    

    // PRIVATE FUNCTIONS //

}