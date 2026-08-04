// 单件商品的数据
class UIGood {
    constructor(good) {
        this.data = good;
        this.choose = 0;
    }
    // 获取总价
    getTotalPrice() {
        return this.data.price * this.choose;
    }

    // 选取/撤销物品，数量加减
    increase() {
        this.choose++;
    }
    decrease() {
        if (this.choose === 0) {
            return;
        }
        this.choose--;
    }
    // 是否选取物品
    isChoose() {
        return this.choose > 0;
    }
}


//整个界面的数据
class UIData {
    constructor() {
        var uiGoods = [];
        for (let i = 0; i < goods.length; i++) {
            // this.goods[i] = new UIGoods(goods[i]);
            var uig = new UIGood(goods[i]);
            uiGoods.push(uig);
        }

        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }

    getAllTotalPrice() {
        let allTotalPricerice = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            allTotalPricerice += this.uiGoods[i].getTotalPrice();
        }
        return allTotalPricerice;
    }

    increase(index) {
        this.uiGoods[index].increase();
    }
    decrease(index) {
        this.uiGoods[index].decrease();
    }


    getAllChooseNumber() {
        let allChooseNumber = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            allChooseNumber += this.uiGoods[i].choose;
        }
        return allChooseNumber;
    }

    isChoose(index) {
        return this.uiGoods[index].isChoose();
    }
}

// 整个界面管理
class UI {
    constructor() {
        this.uiData = new UIData();
        this.doms = {
            goodsContainer: document.querySelector('.goods-list'),
            deliveryPrice: document.querySelector('.footer-car-tip'),
            footerPay: document.querySelector('.footer-pay'),
            footerPayInnerSpan: document.querySelector('.footer-pay span'),
            totalPrice: document.querySelector('.footer-car-total'),
            car: document.querySelector('.footer-car'),
            badge: document.querySelector('.footer-car-badge'),
        };

        // 跳跃目标位置
        var carRect = this.doms.car.getBoundingClientRect();

        var jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5,
        }

        this.jumpTarget = jumpTarget;


        this.initHTML();
        this.updateFooter();
        // this.updateGoods();
        this.listenEvent();


    }

    // 监听各种事件
    listenEvent() {
        this.doms.car.addEventListener('animationend', function () {
            this.classList.remove('animate');
        });
    }


    increase(index) {
        this.uiData.increase(index);
        this.updateFooter();
        this.updateGoods(index);
        this.jumpAnimation(index);


    }
    decrease(index) {
        this.uiData.decrease(index);
        this.updateFooter();
        this.updateGoods(index);
    }

    initHTML() {
        var html = '';
        for (var i = 0; i < goods.length; i++) {
            var g = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
      <img src="${g.data.pic}" alt="" class="goods-pic">
      <div class="goods-info">
        <h2 class="goods-title">${g.data.title}</h2>
        <p class="goods-desc">${g.data.desc}</p>
        <p class="goods-sell">
          <span>月售 ${g.data.sellNumber}</span>
          <span>好评率${g.data.favorRate}%</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${g.data.price}</span>
          </p>
          <div class="goods-btns">
            <i index="${i}" class="iconfont i-jianhao"></i>
            <span>${g.choose}</span>
            <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`;
        }
        this.doms.goodsContainer.innerHTML = html;
    }


    updateFooter() {
        // 购物总数量
        var chooseNumber = this.uiData.getAllChooseNumber();
        if (chooseNumber > 0) {
            this.doms.badge.textContent = chooseNumber;
            this.doms.badge.classList.add('active');
            this.doms.car.classList.add('active');
        } else {
            this.doms.car.classList.remove('active');

        }

        // 购物总价格
        var totalPrice = this.uiData.getAllTotalPrice();
        this.doms.totalPrice.textContent = totalPrice.toFixed(2);

        // 配送费设置
        this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`;


        // 还差多少元
        var money = this.uiData.deliveryThreshold - totalPrice;
        money = Math.round(money);
        if (money > 0) {
            this.doms.footerPayInnerSpan.textContent = `还差￥${money}元起送`;
        } else {
            // 设置样式
            this.doms.footerPayInnerSpan.classList.add('active');
            // 更改内容
            this.doms.footerPayInnerSpan.textContent = `去结算`;
        }


        // 汽车数量



    }

    updateGoods(index) {
        var goodsDom = this.doms.goodsContainer.children[index];
        if (this.uiData.isChoose(index)) {
            goodsDom.classList.add('active');
        } else {
            goodsDom.classList.remove('active');
        }
        var span = goodsDom.querySelector('.goods-btns span');
        span.textContent = this.uiData.uiGoods[index].choose;

    }

    carAnimation() {
        this.doms.car.classList.add('active');
        this.doms.car.classList.add('animate');
    }

    jumpAnimation(index) {

        var startPoint = this.doms.goodsContainer.children[index].querySelector(`.i-jiajianzujianjiahao`);
        var startRect = startPoint.getBoundingClientRect();
        var start = {
            x: startRect.left,
            y: startRect.top,
        }
        console.log(start);

        var div = document.createElement('div')
        div.className = 'add-to-car';

        var i = document.createElement('i');
        i.className = 'iconfont i-jiajianzujianjiahao';

        // 位置设置
        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`;

        div.appendChild(i);
        document.body.appendChild(div);

        div.clientWidth;

        div.style.transform = `translateX(${this.jumpTarget.x}px)`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;


        var that = this;

        console.log(this.jumpTarget);

        div.addEventListener(
            'transitionend',
            function () {
                div.remove();
                that.carAnimation();
            },
            {
                once: true, //触发一次
            }
        )
    }
}

var ui = new UI();

//j监听事件
ui.doms.goodsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('i-jiajianzujianjiahao')) {
        var index = +e.target.getAttribute('index');
        ui.increase(index);
        console.log(index);
        // ui.jumpAnimation(index);

    } else if (e.target.classList.contains('i-jianhao')) {
        var index = +e.target.getAttribute('index');
        ui.decrease(index);
    }
})

window.addEventListener('keypress', function (e) {
    if (e.code === 'Equal') {
        ui.increase(0);
    } else if (e.code === 'Minus') {
        ui.decrease(0);
    }
});
