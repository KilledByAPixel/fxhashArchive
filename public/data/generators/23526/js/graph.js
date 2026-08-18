// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

let G = {};

// Input: lines
// Output: groups with scores
G.add = (graph, id, line, edges) => {
    graph.push({
        id: id,
        line: line,
        edges: edges,
        oedges: [...edges]
    })
}

G.score = (graph) => {
    let score = 0;
    const start = .9;
    const end = .10;
    const steps = 4;
    const decr = (start - end) / steps;

    const scores = [];

    for (let edgeThreshold = start; edgeThreshold > end; edgeThreshold -= decr) {
        G.dropEdges(graph, edgeThreshold);
        G.cluster(graph);
        let clusters = (new Set(graph.map(n => n.tag)));
        let totalCount = 0;
        let clusterCounts = {};
        window.clusters = clusters;
        [...clusters].forEach(tag => {
            for (let i = 0; i < graph.length; i++) {
                if (graph[i].tag == tag) {
                    totalCount += graph[i].line.count;
                    clusterCounts[tag] ||= 0;
                    clusterCounts[tag] += graph[i].line.count;
                }
            }

        });
        // Could weight it here
        scores.push(clusters.size);
    }

    return scores;
}


G.dropEdges = (graph, max) => {
    let count = 0;
    for (let i = 0; i < graph.length; i++) {
        let n = graph[i];
        const initial = n.edges.length;
        n.edges = n.edges.filter((e) => {
            if (e[1] < max) {
                return true;
            }
            else
              return false;
        });

        const after = n.edges.length;
        count += initial - after;
    }
}

G.cluster = (graph) => {
    for (let i = 0; i < graph.length; i++) {
        graph[i].tag = Math.random();
    }

    let done = false;
    let jumps = 0;
    while (!done && jumps < 10) {
        done = true;
        for (let i = 0; i < graph.length; i++) {
            let n = graph[i];
            n.edges.forEach(edge => {
                if (graph[edge[0]].tag != n.tag) {
                    done = false;
                    graph[edge[0]].tag = n.tag;
                }
            })
        }
        jumps++;
    }
}
