/**+
 * Calculate all possible sum permutations for a given list of numbers
 * @param list A list of numbers
 * @return {*[]} All possible sum permutations
 */
function combination(list) {
    let combination = [];
    const total = Math.pow(2, list.length);

    for (let i = 0; i < total; i++) {
        const set = [];
        //For each combination check if each bit is set
        for (let j = 0; j < total; j++) {
            //Is bit j set in i?
            if (Math.pow(2, j) & i) {
                set.push(list[j])
            }
        }

        const sum = set.reduce((partialSum, a) => partialSum + a, 0);
        if (set.length < 1 || combination.includes(sum)) continue;

        combination.push(sum)
    }

    return combination.sort();
}

/**
 * Calculate the volumetric dimensions of the box needed to store products
 * with sizes stored as array of [width, height, length].
 * @param dimensions  A list of all products/boxes to store together in the form width, height, length.
 * @return {{[p: string]: unknown}}  A object of width, height, length values representing the box needed to
 * store all the provided dimensions in.
 */
function calculateVolumetricTotal(dimensions) {
    let totalVolume = 0
    let dims = {
        widthRange: [],
        heightRange: [],
        depthRange: []
    }

    // 1. Find total volume
    // 2. Collect all possible width height and depth values
    dimensions.forEach(dimension => {
        const [width, height, depth] = dimension.map(x => parseFloat(x))
        dims.widthRange.push(width)
        dims.heightRange.push(height)
        dims.depthRange.push(depth)
        totalVolume += width * height * depth
    })

    // sorting happens when combining values
    for (const dim in dims) {
        dims[dim].sort()
    }

    /**
     * 3. Find all possible sum permutations for width, then for height, then for width
     *  3a. Example: sum permutations for width ranges 1,2,3 would be 1, 2, 3, 4, 5, 6
     *  3b. we need this because in no way could the final value for width be 1.5 for example based on the example (3a.)
     */
    const combinations = {
        width: combination(dims.widthRange),
        height: combination(dims.heightRange),
        depth: combination(dims.depthRange)
    }

    /**
     * 4. Find all possible combinations of Width, Height and Depth based on the permutations calculated on (3.)
     */
    let stacks = {};
    combinations.width.forEach(width => {
        combinations.height.forEach(height => {
            combinations.depth.forEach(depth => {
                const v = width * height * depth;
                /**
                 * 5. Store all combinations where the total volume is equal or greater than the total Volume
                 *  5a. This is because it is not possible that the final volume could be less than the actual Volume
                 *  5b. For Volumes greater than (1.) it means that's dead space.
                 */
                if (v >= totalVolume) {
                    stacks[v] = {}
                    stacks[v][width + height + depth] = [width, height, depth]
                }
            })
        })
    })

    /**
     * 6. Sort all combinations from (5.) Ascending,
     * the first result will be the most accurate Volume
     */
    return Object.fromEntries(
        Object.entries(stacks).sort(([v1], [v2]) => v1 < v2 ^ 1),
    )
}


