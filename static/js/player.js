class Player extends Tile {
    constructor(x, y, _) {
        super(x, y);
        this.type = 'player';
        this.color = '#951';
        this.x = x;
        this.y = y;
        this.useAsset = true;
        this.tileType = '';
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    step(tiles) {
        let horizontal = tiles[this.y];
        let vertical = tiles.map((v,i) => { return v[this.x]; });
        let xDistance = horizontal.length;
        let yDistance = vertical.length;
        let invertY = false;
        let invertX = false;
        this.type = 'player';
        for (let i = 0; i < horizontal.length; i++) {
            if (i < this.x) {
                if (horizontal[i].obstacle) {
                    xDistance = horizontal.length; 
                }
                if (['pull','exit', 'push', 'toggle_pull'].indexOf(horizontal[i].type) >= 0) {
                    xDistance = 0; 
                }
                xDistance++;
                if (horizontal[i].type == 'push') invertX = true;    
            }
            if (i > this.x) {
                if (horizontal[i].obstacle) {
                    xDistance = -xDistance
                    break;
                }
                if (['pull','exit', 'push', 'toggle_pull'].indexOf(horizontal[i].type) >= 0 && horizontal[i].x - this.x <= xDistance) {
                    xDistance = horizontal[i].x - this.x;
                    if (['pull','exit','toggle_pull'].indexOf(horizontal[i].type) >= 0) invertX = false;
                    if (horizontal[i].type == 'push' && !invertX) invertX = true;   
                    break;
                }
            }
        }
        if (invertX) xDistance *= -1;
        if (vertical.filter(t => ['pull','exit', 'push', 'toggle_pull'].indexOf(t.type) >= 0).length > 0) {
            for (let i = 0; i < vertical.length; i++) {
                if (i < this.y) {
                    if (vertical[i].obstacle) {
                        yDistance = vertical.length; 
                    }
                    if (['pull','exit', 'push', 'toggle_pull'].indexOf(vertical[i].type) >= 0) {
                        yDistance = 0; 
                    }
                    yDistance++;
                    if (vertical[i].type == 'push') invertY = true;
                    if (['pull','exit', 'toggle_pull'].indexOf(vertical[i].type) >= 0) invertY = false;
 
                }
                if (i > this.y) {
                    if (vertical[i].obstacle) {
                        yDistance = -yDistance
                        break;
                    }
                    if (['pull','exit', 'push', 'toggle_pull'].indexOf(vertical[i].type) >= 0 &&  vertical[i].y - this.y <= yDistance) {
                        yDistance = vertical[i].y - this.y;
                        if (['pull','exit','toggle_pull'].indexOf(vertical[i].type) >= 0) invertX = false; 
                        if (vertical[i].type == 'push' && !invertY) invertY = true; 
                        break;
                    }
                }
            }
        }
        if (invertY) yDistance *= -1;
        if (Math.abs(yDistance) >= horizontal.length && Math.abs(xDistance) >= vertical.length) {
            return;
        }
        if (Math.abs(yDistance) < Math.abs(xDistance)) {
            if (yDistance < 0)  {
                this.y--;
                this.type = 'player_up';
            }
            if (yDistance > 0)  {
                this.y++;
                this.type = 'player_down';
            }
        }
        if (Math.abs(xDistance) < Math.abs(yDistance)) {
            if (xDistance < 0)  {
                this.x--;
                this.type = 'player_left';
            }
            if (xDistance > 0)  {
                this.x++;
                this.type = 'player_right';
            }
        }
    }
    moveToPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}