define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var MISC_KEY = 'misc-undefined-3y8241903740139287491207843912078349012374';
  var MISC_TEXT = 'Misc';

  var PileSelectorView = function(deps) {
    ensure(['element', 'ideas', 'pileCreator'], deps);

    var reactElement;

    function init() {
      var container = normalizeElement(deps.element);
      var componentProps = {
        ideas: deps.ideas,
        choosePile: choosePileHandler,
        addPile: deps.pileCreator.summon,
        filter: filterPiles,
      };
      reactElement = React.render(
        React.createElement(Component, componentProps),
        container
      );

      updatePiles();
      deps.ideas.onPilesChanged(updatePiles);

      showCurrentPile();
      deps.ideas.onCurrentPileChanged(showCurrentPile);
    };

    function updatePiles() {
      reactElement.setState({piles: deps.ideas.pileNames()});
    };

    function showCurrentPile() {
      reactElement.setState({currentPile: deps.ideas.currentPile()});
    };

    function filterPiles(event) {
      var query = event.target.value;
      reactElement.setState({filterQuery: query});
    };

    function choosePileHandler(pile) {
      return function() {
        deps.ideas.usePile(pile);
      };
    };

    init();
  };

  var Component = React.createClass({
    render: function() {
      var component = this;

      return (
        <div className="pile-selector">
          <div className="filter-container">
            <input className="filter" onChange={this.props.filter} />
            <i className="fa fa-search"></i>
          </div>
          <ul>
            {renderPiles()}
          </ul>
          <div className="add-pile" onClick={this.props.addPile}>Add Pile</div>
        </div>
      );

      function renderPiles() {
        var renderedPiles = [];
        var piles = filteredPiles();;
        piles.forEach(function(pile) {
          renderedPiles.push(renderPile(pile));
        });
        if (piles.length === 1) {
          renderedPiles.push(<li className="pile placeholder">No other piles</li>);
        }
        return renderedPiles;
      }

      function filteredPiles() {
        var filteredPiles = [];
        if (component.state && component.state.piles) {
          component.state.piles.forEach(function(pile) {
            if (pileMatchesFilter(pile)) {
              filteredPiles.push(pile);
            }
          });
        }
        return filteredPiles;
      }

      function renderPile(pile) {
        var classes = React.addons.classSet({
          'pile': true,
          'current-pile': component.state.currentPile === pile,
        });
        return(
          <li key={pile} onClick={component.props.choosePile(pile)} className={classes}>
            {pile}
          </li>
        );
      }

      function pileMatchesFilter(pile) {
        if (!component.state.filterQuery || component.state.filterQuery.length === 0 || component.state.currentPile === pile) {
          return true;
        }
        return pile.indexOf(component.state.filterQuery) > -1;
      }
    },
  });

  return PileSelectorView;
});
