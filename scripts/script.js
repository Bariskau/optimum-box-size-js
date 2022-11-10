/**
 * create column
 * @return {HTMLDivElement}
 */
function createCol() {
    const col = document.createElement('div')
    col.classList.add('col-xl-4', 'col-lg-6', 'col-md-12', 'col-sm-12')

    return col
}

/**
 * create card element
 * @param width
 * @param height
 * @param depth
 * @param scale
 * @return {HTMLDivElement}
 */
function createCard(width, height, depth, scale) {
    const card = document.createElement('div')
    card.classList.add('card', 'align-items-center', 'justify-content-center')

    const box = createBox()
    box.style.setProperty('--width', `${width * scale}px`)
    box.style.setProperty('--height', `${height * scale}px`)
    box.style.setProperty('--depth', `${depth * scale}px`)

    const footer = document.createElement('div')
    footer.classList.add('card-header');

    footer.appendChild(box)

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body');
    cardBody.innerHTML = `
                            <span><strong>Width:</strong> ${width}</span> X 
                            <span><strong>Height:</strong> ${height}</span> X 
                            <span><strong>Depth:</strong> ${depth}</span>
                          `

    card.appendChild(footer)
    card.appendChild(cardBody)

    return card
}

/**
 * create box text element
 * @param cssClass
 * @param text
 * @return {HTMLDivElement}
 */
function createBoxContent(cssClass, text) {
    const boxFace = document.createElement('div')
    boxFace.classList.add(cssClass)
    const content = document.createElement('span')
    content.innerText = text
    boxFace.appendChild(content)

    return boxFace;
}

/**
 * create box element
 * @return {HTMLDivElement}
 */
function createBox() {
    const box = document.createElement('div')
    box.classList.add('box');

    ['top', 'down', 'right', 'left', 'aux'].forEach(face => {
        const el = document.createElement('div')
        el.classList.add(face)

        if (face === 'left') {
            el.appendChild(createBoxContent('dp-text', 'Depth'))
        } else if (face === 'aux') {
            const front = document.createElement('div')
            front.classList.add('front')
            front.appendChild(createBoxContent('wd-text', 'Width'))

            const back = document.createElement('div')
            back.classList.add('back')
            back.appendChild(createBoxContent('hg-text', 'Height'))

            el.appendChild(front)
            el.appendChild(back)
        }

        box.appendChild(el)
    })

    return box;
}

/**
 * add box
 * @param width
 * @param height
 * @param depth
 * @param scale
 * @return {HTMLDivElement}
 */
function addBox(width, height, depth, scale) {
    const col = createCol()
    const card = createCard(width, height, depth, scale)

    col.appendChild(card)
    return col
}

/**
 * create new form element
 */
function addBoxInput() {
    const group = document.getElementById('form-group')
    const formInput = document.getElementById('form-input')

    const newInput = formInput.cloneNode(true)
    newInput.id = 'form-input-' + group.childElementCount

    const inputs = newInput.querySelectorAll('#width, #height, #depth');
    inputs.forEach(input => {
        input.value = '';
    });

    group.appendChild(newInput)
}

/**
 * listen submit event
 */
document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.target
    const formData = new FormData(form);

    let data = {}
    const dims = []

    for (let pair of formData.entries()) {
        switch (pair[0]) {
            case 'width':
                data.width = pair[1]
                break;
            case 'height':
                data.height = pair[1]
                break;
            case 'depth':
                data.depth = pair[1]
                break
        }

        if (data.width && data.height && data.depth) {
            dims.push([data.width, data.height, data.depth])
            data = {}
        }
    }
    const boxes = document.getElementById('boxes')

    // prepare data for visualization
    let vals = calculateVolumetricTotal(dims)
    vals = Object.entries(vals).map(([k, v]) => {
        return {volume: k, dims: v[Object.keys(v)[0]]}
    }).sort((a, b) => a.volume - b.volume)

    vals.forEach((val) => {
        const scale = 180 / Math.max(...val.dims)
        const box = addBox(
            val.dims[0],
            val.dims[1],
            val.dims[2],
            scale
        )
        boxes.appendChild(box)
    })

    const formBoxes = document.getElementById('box-form')
    formBoxes.classList.add('d-none')
    boxes.classList.remove('d-none')
});
