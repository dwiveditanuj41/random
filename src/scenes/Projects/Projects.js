import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import styled from 'styled-components';
import {
  Loader,
  Grid,
  Segment,
  Image,
  Message,
  Dimmer,
} from '@indshine/ui-kit';
import InfiniteScroll from 'react-infinite-scroller';
import { toast } from 'react-toastify';
import { get } from 'lodash-es';

import useApi from '../../hooks/useApi';
import ProjectCard from '../../components/ProjectCard';
import AuthContext from '../../contexts/AuthContext';
import NewProject from '../../components/NewProject';
import AppShell from '../../components/AppShell';
import mediaQuerySize from '../../utils/mediaQuerySize';

const Projects = () => {
  const { userInfo } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState(null);

  const [hasMoreProjects, setHasMoreProjects] = useState(false);

  const lastProjectIndex = useRef();

  const api = useApi();

  const wrapper = useRef();

  const getProjects = useCallback(async () => {
    if (userInfo) {
      try {
        const response = await api.get(
          `/access?email=${userInfo.email}&status=enabled&index=${
            lastProjectIndex.current ? lastProjectIndex.current : 0
          }&limit=20`,
        );
        const { items, index, truncated } = response.data;

        setProjects(projectsState =>
          projectsState ? [...projectsState, ...items] : items,
        );
        setHasMoreProjects(truncated);
        lastProjectIndex.current = index;
      } catch (error) {
        const errorMessage = get(
          error,
          'response.data.message',
          'Something went wrong. Please try again',
        );
        toast.error(errorMessage);
        setHasMoreProjects(false);
        lastProjectIndex.current = null;
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, api]);

  useEffect(() => {
    getProjects();
  }, [userInfo, getProjects]);

  const loadMoreProjects = () => {
    if (!loading) {
      getProjects();
    }
  };
  console.log({ projects });

  return (
    <AppShell>
      {(() => {
        if (loading) {
          return (
            <StyledDimmer active inverted>
              <Loader>Loading Projects...</Loader>
            </StyledDimmer>
          );
        }

        if (!projects) {
          return (
            <ContentContainer>
              <Grid>
                <Grid.Row>
                  <Grid.Column width="4">
                    <Message
                      header="Something went wrong"
                      content="Please try again"
                      error
                      icon="warning circle"
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </ContentContainer>
          );
        }

        if (projects && projects.length === 0) {
          return (
            <StyledSegment
              placeholder
              padded
              size="big"
              textAlign="center"
              basic
            >
              <Image
                src={require('../../images/placeholder.svg')}
                alt="Create New Project"
                centered
                size="medium"
              />
              <h3>You don't have any projects yet!</h3>
              <NewProject />
            </StyledSegment>
          );
        }

        return (
          <Wrapper ref={wrapper}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={loadMoreProjects}
              hasMore={hasMoreProjects}
              loader={
                <Segment key={0} basic>
                  <StyledDimmer active inverted>
                    <Loader size="mini" />
                  </StyledDimmer>
                </Segment>
              }
              useWindow={false}
              getScrollParent={() => wrapper.current}
            >
              <ContentContainer>
                <Grid columns="4" stackable>
                  {projects.map(project => {
                    return (
                      <Grid.Column
                        key={project.id}
                        mobile={16}
                        tablet={8}
                        computer={5}
                        largeScreen={4}
                      >
                        <ProjectCard
                          project={project.project}
                          onDelete={deletedProject => {
                            setProjects(projectState =>
                              projectState.filter(projectItem => {
                                return (
                                  projectItem.project.id !== deletedProject.id
                                );
                              }),
                            );
                          }}
                          onUpdate={updatedProject => {
                            setProjects(projectState => {
                              return projectState.map(projectItem => {
                                if (
                                  projectItem.project.id === updatedProject.id
                                ) {
                                  return {
                                    ...projectItem,
                                    project: updatedProject,
                                  };
                                }
                                return projectItem;
                              });
                            });
                          }}
                        />
                      </Grid.Column>
                    );
                  })}
                </Grid>
              </ContentContainer>
            </InfiniteScroll>
          </Wrapper>
        );
      })()}
    </AppShell>
  );
};

export default Projects;

const StyledDimmer = styled(Dimmer)`
  background-color: transparent !important;
`;

const ContentContainer = styled.div`
  padding: 2em;
  width: 100%;
  height: 100%;

  @media ${mediaQuerySize.md} {
    padding: 1em;
  }

  @media ${mediaQuerySize.sm} {
    padding: 1em 0;
  }
`;

const StyledSegment = styled(Segment)`
  width: 80% !important;
  margin: 0 auto !important;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;
