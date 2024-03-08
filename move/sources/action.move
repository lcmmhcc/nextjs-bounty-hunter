
module bounty_hunter::action {

    friend bounty_hunter::human;

    struct Action has store, drop {
        value : u64,
        attr : u64,
        counter : bool
    }

    // PUBLIC FRIEND FUNCTIONS //   
    public(friend) fun create(value : u64, attr : u64, counter : bool): Action {
       Action { 
            value, 
            attr, 
            counter,
        }
    }

    public(friend) fun get_value(atk : &Action) : u64 {
        atk.value
    }

    public(friend) fun get_attr(atk : &Action) : u64 {
        atk.attr
    }

    public(friend) fun is_counter(atk : &Action) : bool {
        atk.counter
    }

    // PRIVATE FUNCTIONS //


}