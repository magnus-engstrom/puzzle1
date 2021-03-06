let imageAssets = new Map();
[
    'pull', 
    'push', 
    'wall', 
    'player', 
    'toggle_pull', 
    'toggle_idle', 
    'toggle', 
    'blocked', 
    'exit', 
    'player_right', 
    'player_up', 
    'player_down', 
    'player_left', 
    'hint', 
    'play', 
    'reload'
].forEach((s) => {
    const image = new Image();
    image.src = '/static/img/' + s + '.png';
    imageAssets.set(s, image);
})

class Tile {
    constructor(x, y, _=0) {
        this.type = 'tile';
        this.color = 'red'
        this.useAsset = false;
        this.obstacle = false;
        this.x = x;
        this.y = y;
        this.render = true;
        this.onInteraction = 'block';
        this.toggling = false;
        this.drawShadow = true;
    }
    static getAsset(id, counter, type) {
        const image = imageAssets.get(type);
        if (id != -1) {
            image.setAttribute('data-id', id);
            image.setAttribute('data-type', type);
            image.setAttribute('data-count', counter);
        }
        return image;
    }
}

class WallTile extends Tile {
    constructor(x, y, _) {
        super(x, y);
        this.type = 'wall';
        this.obstacle = true;
        this.color = '#444';
        this.useAsset = true;
    }
}

class EmptyTile extends Tile {
    constructor(x, y, _) {
        super(x, y);
        this.type = 'floor';
        this.obstacle = false;
        this.color = '#999';
        this.onInteraction = 'replace';
        this.render = false;
    }
}
class BlockedTile extends Tile {
    constructor(x, y, _) {
        super(x, y);
        this.type = 'blocked';
        this.obstacle = false;
        this.color = '#999';
        this.onInteraction = '';
        this.render = true;
        this.useAsset = true;
        this.drawShadow = false;
    }
}

class PullTile extends Tile {
    constructor(x, y, _) {
        super(x, y);
        this.type = 'pull';
        this.obstacle = false;
        this.color = '#395';
        this.onInteraction = 'undo';
        this.useAsset = true;
    }
    static getType() {
        return 'pull';
    }
}

class togglePullTile extends PullTile {
    constructor(x, y, ticker=0) {
        super(x, y);
        this.type = 'toggle';
        this.startTicker = ticker;
        this.toggling = true;
        this.useAsset = true;
    }
    static getType() {
        return 'toggle';
    }
    toggle(ticker) {
        if (ticker != this.startTicker) {
            this.type = 'toggle_idle';
            this.color = '#666';
        } else {
            this.type = 'toggle_pull';
            this.color = '#395';            
        }
    }
}

class TargetTile extends PullTile {
    constructor(x, y, _) {
        super(x, y);
        this.color = '#0F0';
        this.type = 'exit';
    }
}

class PushTile extends Tile {
    constructor(x, y, _) {
        super(x, y);
        this.type = 'push';
        this.obstacle = false;
        this.color = '#945';
        this.onInteraction = 'undo';
        this.useAsset = true;
    }
    static getType() {
        return 'push';
    }
}