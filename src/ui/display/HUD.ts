import {Container, Text, TextStyle, Sprite, Assets} from "pixi.js";
import gsap from "gsap";

export class HUD extends Container {
    private balanceValue!: Text;
    private betValue!: Text;

    constructor(balance: number, bet: number) {
        super();
        this.create(balance, bet);
        this.createMega();
    };

    private get textStyle(): TextStyle {
        return new TextStyle({
            fontFamily: "Viga",
            fontSize: 50,
            fill: "#b1adad",
            fontWeight: "bold",
        });
    };

    private create(balance: number, bet: number): void {
        this.createBalanceSection(balance);
        this.createBetSection(bet);
    };

    private createBalanceSection(balance: number): void {
        const coin = new Sprite(Assets.get('buttons').textures['coins_m']);
        coin.anchor.set(0.5);
        coin.scale.set(0.35);
        coin.position.set(100, 650);

        coin.eventMode = 'none';

        this.addChild(coin);

        this.balanceValue = new Text({
            text: `${balance}`,
            style: this.textStyle
        });
        this.balanceValue.anchor.set(0.5);
        this.balanceValue.position.set(190, 650);
        this.addChild(this.balanceValue);
    };

    private createBetSection(bet: number): void {
        this.betValue = new Text({
            text: `${bet}`,
            style: this.textStyle
        });
        this.betValue.anchor.set(0.5);
        this.betValue.position.set(543, 650);
        this.addChild(this.betValue);
    };

    public updateBalance(balance: number): void {
        const obj = { value: Number(this.balanceValue.text) };

        gsap.to(obj, {
            value: balance,
            duration: 0.4,
            onUpdate: () => {
                this.balanceValue.text = Math.floor(obj.value).toString();
            }
        });
    };

    public updateBet(bet: number): void {
        this.betValue.text = `${bet}`;
    };

    private createMega(): void {
        const frames_1 = new Sprite(Assets.get('game').textures['jp_display_1']);
        frames_1.anchor.set(0.5);
        frames_1.scale.set(1.3, 1.3);
        frames_1.position.set(250, 70);

        const frames_2 = new Sprite(Assets.get('game').textures['jp_display_2']);
        frames_2.anchor.set(0.5);
        frames_2.scale.set(1.3, 1.3);
        frames_2.position.set(830, 70);

        this.addChild(frames_1, frames_2);
    }
}