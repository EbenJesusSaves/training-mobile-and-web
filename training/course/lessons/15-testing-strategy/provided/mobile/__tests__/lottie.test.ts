import { swapNeutralColors } from '@/libs/lottie';

const fill = (rgba: number[]) => ({ ty: 'fl', c: { a: 0, k: rgba } });

describe('swapNeutralColors', () => {
  it('swaps near-black and near-white fills and leaves brand colours alone', () => {
    const animation = { layers: [{ shapes: [fill([0, 0, 0, 1]), fill([1, 1, 1, 1]), fill([0, 0.78, 0.49, 1])] }] };

    const result = swapNeutralColors(animation, { dark: '#FFFFFF', light: '#000000' });

    expect(result.layers[0].shapes.map((shape) => shape.c.k)).toEqual([
      [1, 1, 1, 1],
      [0, 0, 0, 1],
      [0, 0.78, 0.49, 1],
    ]);
    expect(animation.layers[0].shapes[0].c.k).toEqual([0, 0, 0, 1]);
  });

  it('swaps animated colour keyframes', () => {
    const animation = { shape: { ty: 'st', c: { a: 1, k: [{ s: [0, 0, 0, 1] }] } } };

    const result = swapNeutralColors(animation, { dark: '#FFFFFF', light: '#000000' });

    expect(result.shape.c.k[0].s).toEqual([1, 1, 1, 1]);
  });
});
