import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Search, Grid, Image, Header } from '@indshine/ui-kit';
import { withRouter } from 'react-router-dom';
import _ from 'lodash-es';

import withApi from '../../utils/withApi';

class SearchBar extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
  };

  state = {
    isLoading: false,
    results: [],
    value: '',
  };

  resultRenderer = result => {
    return (
      <Grid>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width="4">
            <StyledImage src={result.image} />
          </Grid.Column>
          <Grid.Column width="12">
            <StyledHeader> {result.title} </StyledHeader>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  handleSearchChange = async event => {
    const { value } = event.target;
    this.setState({
      isLoading: true,
      value,
      results: [],
    });
    try {
      const { api } = this.props;
      const { data } = await api.get(`/search?q=${value}`);

      const searchResults = data.personalProjects.map(res => {
        return {
          title: res._source.name,
          description: res._source.description,
          id: res._source.id,
          image: res._source.thumbnail
            ? `${process.env.REACT_APP_VISUALIZE_CDN_URL}/${
                res._source.thumbnail
              }`
            : require('../../images/thumbnail-placeholder.jpg'),
        };
      });
      this.setState({
        results: searchResults,
      });
    } catch (error) {
      this.setState({
        results: [],
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleResultSelect = (event, { result }) => {
    const { history } = this.props;
    history.push(`/projects/${result.id}`);
    this.setState({ value: result.title });
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <SearchContainer>
        <StyledSearch
          icon="search"
          loading={isLoading}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
          onResultSelect={this.handleResultSelect}
          resultRenderer={this.resultRenderer}
          placeholder="Search projects..."
          fluid
        />
      </SearchContainer>
    );
  }
}

export default withRouter(
  withApi(SearchBar, process.env.REACT_APP_API_BASE_URL),
);

const StyledHeader = styled(Header)`
  font-size: 1em !important;
  display: in-line-block !important;
`;

const SearchContainer = styled.div`
  width: 20em;
`;

const StyledSearch = styled(Search)`
  & .ui.input {
    width: 100% !important;
  }
`;

const StyledImage = styled(Image)`
  height: 100% !important;
  width: 100% !important;
  object-fit: cover !important;
`;
