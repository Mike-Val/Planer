import { PCA, PCAOptions } from 'ml-pca';
import { Plane, Vector3 } from 'three';


export interface Options {
    PCAOptions?: PCAOptions;
    unsafe?: boolean;
    plane?: Plane;
}


export function findPlane(points: number[][] | Vector3[], options: Options = {}): Plane | null {
    if (points.length < 3) return null;
    
    let _points = points as number[][];

    if (options.unsafe 
        ? points[0] instanceof Vector3 
        : points.every(point => point instanceof Vector3)
    ) _points = (points as Vector3[]).map(point => point.toArray());

    const opt = { ...options.PCAOptions };
    opt.isCovarianceMatrix = true;

    const center = new Vector3(..._points.reduce((acc, point) => {
        acc[0] += point[0];
        acc[1] += point[1];
        acc[2] += point[2];
        return acc;
    }, [0, 0, 0]).map(value => value / _points.length));

    const pca = new PCA(_points, opt);
    const eigenValues = pca.getEigenvalues();
    const smallestEigenValue = eigenValues.indexOf(Math.min(...eigenValues));
    const normal = new Vector3(...pca.getEigenvectors().getColumn(smallestEigenValue));

    const plane = options.plane ?? new Plane();
    plane.setFromNormalAndCoplanarPoint(normal, center);

    return plane;
}