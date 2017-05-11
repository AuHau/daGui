import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

export default {
  'in': {
    position: {
      name: 'left'
    },
    attrs: {
      '.port-label': {
        fill: '#000'
      },
      '.port-body': {
        fill: cssVariables.portInColor,
        r: 4,
        magnet: 'passive'
      }
    }
  },
  'out': {
    position: {
      name: 'right'
    },
    attrs: {
      '.port-label': {
        fill: '#000'
      },
      '.port-body': {
        fill: cssVariables.portOutColor,
        r: 4,
        magnet: true
      }
    }
  }
};
