let getIndex = (index, arrLength, type) => {
    if(type === 'prev') {
        return (index != arrLength - 1) ? index + 1 : 0
    } else {
        return index != 0 ? index - 1 : arrLength - 1
    }
}

let getClass = (index, currentItemId, arrLength, type, showSwiperAnimate) => {
    if(index == currentItemId) {
        return type == '1' ? (showSwiperAnimate ? 'selected' : 'selected-special') : 'swiper-item'
    } 
    if(index == currentItemId - 1) {
        return type == '1' ? 'prev' : 'swiper-item-prev'
    }
    if(index == currentItemId + 1) {
        return type == '1' ? 'next' : 'swiper-item-next'
    }
    if(index == 0 && currentItemId == (arrLength-1)) {
        return type == '1' ? 'next' : 'swiper-item-next'
    }
    if(index == (arrLength-1) && currentItemId == 0) {
        return type == '1' ? 'prev' : 'swiper-item-prev'
    }
    if(currentItemId < 2 && index > 3 && index <= (arrLength-1)) {
        return type == '1' ? 'prev-normal' : 'swiper-item-prev-normal'
    }
    if(currentItemId > 3 && index >= 0 && index < 2) {
        return type == '1' ? 'next-normal' : 'swiper-item-next-normal'
    }
    if(index < currentItemId) {
        return type == '1' ? 'prev-normal' : 'swiper-item-prev-normal'
    }
    if(index > currentItemId) {
        return type == '1' ? 'next-normal' : 'swiper-item-next-normal'
    }
    return ''
}

let getDollars = (prize) => {
    if(prize == '0.1') {
        return '0.12'
    }
    if(prize=='0.5'){
        return '0.6'
    }
    if(prize=='1'){
         return '1.2'
    }
    if(prize=='2'){
         return '2.4'
    }
}

export default {
    getIndex: getIndex,
    getClass: getClass,
    getDollars: getDollars
};
