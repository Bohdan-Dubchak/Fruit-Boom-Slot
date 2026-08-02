import {Container, Text} from "pixi.js";

export class JackpotDisplay extends Container {
    private readonly megaText: Text;
    private readonly miniText: Text;

    private readonly megaMultiplier: number;
    private readonly miniMultiplier: number;

    constructor(megaMultiplier: number = 200, miniMultiplier: number = 1) {
        super();

        this.megaMultiplier = megaMultiplier;
        this.miniMultiplier = miniMultiplier;

        this.megaText = this.createText();
        this.miniText  = this.createText();

        this.megaText.position.set(244, 80);
        this.miniText .position.set(828, 80);

        this.addChild(this.megaText, this.miniText);
    };

    private createText(): Text {
        const text = new Text({
            text: '0',
            style: {
                fontFamily: 'Alpha',
                fontSize: 40,
                fill: '#ffde4d',
                fontWeight: 'bold'
            }
        });

        text.anchor.set(0.5);
        return text;
    };

    public updateBet(bet: number): void {
        this.megaText.text = String(bet * this.megaMultiplier);
        this.miniText.text = String(bet * this.miniMultiplier);
    };
}