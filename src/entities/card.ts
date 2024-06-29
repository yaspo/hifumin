import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Mapper} from "./mapper.js";
import {DiscordUser} from "./discordUser.js";
import {CardCondition} from "./cardCondition.js";

@Entity('card')
export class Card {
    @PrimaryColumn('char', {length: 4})
    id!: string;

    @ManyToOne(() => Mapper, {eager: false, nullable: false})
    @JoinColumn({name: 'mapper_id'})
    mapper!: Mapper;

    @ManyToOne(() => DiscordUser, {eager: false, nullable: true})
    @JoinColumn({name: 'owner_id'})
    owner?: DiscordUser;

    @ManyToOne(() => DiscordUser, {eager: false, nullable: false})
    @JoinColumn({name: 'dropped_by_id'})
    droppedBy!: DiscordUser;

    @ManyToOne(() => DiscordUser, {eager: false, nullable: true})
    @JoinColumn({name: 'claimed_by_id'})
    claimedBy!: DiscordUser;

    @Column({type: 'varchar', length: 30})
    username!: string;

    @Column({type: 'varchar', length: 255})
    avatarUrl!: string;

    @Column({type: 'datetime'})
    createdAt!: Date;

    @ManyToOne(() => CardCondition, {eager: false, nullable: false})
    @JoinColumn({name: 'condition'})
    condition!: CardCondition;

    @Column('boolean', {default: false, nullable: false})
    burned!: boolean;

    @Column('boolean', {default: false, nullable: false})
    foil!: boolean;

    get burnValue() {
        let value = this.mapper.rarity * this.condition.multiplier * 5
        
        if(this.foil) {
            value = value * 2;
        }

        return Math.ceil(value);
    }

    get dustValue() {
        return Math.ceil(this.mapper.rarity * 0.1)
    }

    get dustType(): string {
        return {
            'BadlyDamaged' : 'damaged dust',
            'Poor' : 'poor dust',
            'Good' : 'good dust',
            'Mint' : 'mint dust',
        }[this.condition.id]!
    }

    get attributes() {
        const attributes : string[] = []

        if(this.foil)
            attributes.push('Foil')

        return attributes
    }

}