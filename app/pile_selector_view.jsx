define(function(require) {
  var ensure = require('ensure');
  var normalizeElement = require('normalize_element');
  var React = require('react');

  var MISC_KEY = 'misc-undefined-3y8241903740139287491207843912078349012374';
  var MISC_TEXT = 'Misc';

  var PileSelectorView = function(deps) {
    ensure(['element', 'ideas'], deps);

    var reactElement;

    function init() {
      var container = normalizeElement(deps.element);
      var componentProps = {
        ideas: deps.ideas,
        choosePile: choosePileHandler,
        createFilterValue: deps.ideas.usePile,
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

    function choosePileHandler(pile) {
      return function() {
        deps.ideas.usePile(pile);
      };
    };

    init();
  };

  var Component = React.createClass({
    getInitialState: function() {
      return {
        filterQuery: '',
      };
    },
    render: function() {
      var component = this;

      return (
        <div className="component-root">
          <div className="selector">
            <ul>
              {renderFilteredPiles()}
            </ul>
            <div className="filter-container">
              <input
                className="filter"
                value={this.state.filterQuery}
                onKeyDown={handleFilterKeyDown}
                onKeyUp={handleFilterKeyUp}
                onChange={handleFilterChange} />
              <i className="fa fa-search"></i>
            </div>
          </div>
          {renderCurrentPile()}
        </div>
      );

      function renderCurrentPile() {
        return (<h1 className="current-pile">{pileText(component.state.currentPile)}</h1>);
      }

      function renderFilteredPiles() {
        var renderedPiles = [];
        var piles = filteredPiles();
        piles.forEach(function(pile) {
          renderedPiles.push(renderPile(pile));
        });
        if (piles.length === 0) {
          renderedPiles.push(renderPlaceholder());
        }
        return renderedPiles;
      }

      function renderPlaceholder() {
        var text = (
          <span>
            <span>Search </span>
            <span className="note">(Shift + Enter to add)</span>
          </span>
        );
        if ((filterIsActive() && component.state.forceCreateFilterValue) || filterIsActive() && component.state.filterQuery !== component.state.currentPile) {
          text = "Add '" + component.state.filterQuery + "'";
        }
        return (<li className="pile prompt">{text}</li>);
      }

      function filteredPiles() {
        var filteredPiles = [];
        if (!component.state.forceCreateFilterValue && component.state && component.state.piles) {
          component.state.piles.forEach(function(pile) {
            if (pileMatchesFilter(pile)) {
              filteredPiles.push(pile);
            }
          });
        }
        return filteredPiles;
      }

      function renderPile(pile) {
        return(
          <li key={pile} onClick={component.props.choosePile(pile)} className="pile">
            {pileText(pile)}
          </li>
        );
      }

      function pileText(pile) {
        if (filterIsActive()) {
          var filterQuery = component.state.filterQuery;
          var nonMatchFragments = [];
          pile.split(filterQuery).forEach(function(fragment) {
            nonMatchFragments.push(<span className="non-match">{fragment}</span>);
          });
          var fragments = [];
          var lastNonMatchIndex = nonMatchFragments.length - 1;
          for (var i = 0; i < lastNonMatchIndex; i++) {
            fragments.push(nonMatchFragments[i]);
            fragments.push(<span className="match">{filterQuery}</span>);
          }
          fragments.push(nonMatchFragments[lastNonMatchIndex]);
          return fragments;
        }
        return pile;
      }

      function filterIsActive() {
        var filterQuery = component.state.filterQuery;
        return filterQuery !== undefined && filterQuery.length > 0;
      }

      function pileMatchesFilter(pile) {
        return (
          // current pile is treated separately
          pile !== component.state.currentPile

          && (
            // without a filter query, all other piles match
            !component.state.filterQuery
            || component.state.filterQuery.length === 0

            // with a filter query, if the pile includes the query, it matches
            || pile.indexOf(component.state.filterQuery) > -1
          )
        );
      }

      function handleFilterChange(event) {
        var query = event.target.value;
        component.setState({filterQuery: query});
      }

      function handleFilterKeyDown(event) {
        switch (event.key) {
          case 'Enter':
            var query = component.state.filterQuery;

            var _filteredPiles = filteredPiles();
            if (_filteredPiles.length > 0) {
              var firstMatch = _filteredPiles[0]
              component.props.choosePile(firstMatch)();
            } else {
              component.props.createFilterValue(query);
            }

            component.setState({filterQuery: ''});
            break;
          case 'Shift':
            component.setState({forceCreateFilterValue: true});
            break;
        }
      }

      function handleFilterKeyUp(event) {
        switch (event.key) {
          case 'Shift':
            component.setState({forceCreateFilterValue: false});
            break;
        }
      }
    },
  });

  return PileSelectorView;
});
