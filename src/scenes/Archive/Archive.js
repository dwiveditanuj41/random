import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import styled from 'styled-components';
import {
  Segment,
  Dimmer,
  Loader,
  Grid,
  Message,
  Image,
  Header,
  Button,
  Table,
} from '@indshine/ui-kit';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';

import useApi from '../../hooks/useApi';
import AuthContext from '../../contexts/AuthContext';
import AppShell from '../../components/AppShell';
import DeletedProjectCard from '../../components/DeletedProjectCard';
import DeletedFileRow from './components/DeletedFileRow';
import mediaQuerySize from '../../utils/mediaQuerySize';

const Archive = () => {
  const [loadingDeletedProjects, setLoadingDeletedProjects] = useState(true);
  const [deletedProjects, setDeletedProjects] = useState(null);
  const [hasMoreDeletedProjects, setHasMoreDeletedProjects] = useState(false);
  const deletedProjectsIndex = useRef();

  const [loadingDeletedFiles, setLoadingDeletedFiles] = useState(true);
  const [deletedFiles, setDeletedFiles] = useState(null);
  const [hasMoreDeletedFiles, setHasMoreDeletedFiles] = useState(false);
  const deletedFilesIndex = useRef();

  const api = useApi();

  const { user } = useContext(AuthContext);

  const fetchDeletedProjects = useCallback(async () => {
    setLoadingDeletedProjects(true);
    try {
      const {
        data: { items, index, isTruncated },
      } = await api.get(
        `/projects?status=DISABLED&modifiedBy=${
          user.attributes.sub
        }&index=${deletedProjectsIndex.current || 0}&limit=10`,
      );
      console.log(user.attributes.sub);
      setDeletedProjects(deletedProjectsState =>
        deletedProjectsState ? [...deletedProjectsState, ...items] : items,
      );
      setHasMoreDeletedProjects(isTruncated);
      deletedProjectsIndex.current = index;
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      setDeletedProjects(deletedProjectsState => deletedProjectsState || null);
      setHasMoreDeletedProjects(false);
    } finally {
      setLoadingDeletedProjects(false);
    }
  }, [api, user]);

  const fetchDeletedFiles = useCallback(async () => {
    setLoadingDeletedFiles(true);
    try {
      const {
        data: { items, index, isTruncated },
      } = await api.get(
        `/data?status=DISABLED&modifiedBy=${
          user.attributes.sub
        }&index=${deletedProjectsIndex.current || 0}`,
      );
      setDeletedFiles(deletedFilesState =>
        deletedFilesState ? [...deletedFilesState, ...items] : items,
      );
      setHasMoreDeletedFiles(isTruncated);
      deletedFilesIndex.current = index;
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.message',
        'Something went wrong. Please try again',
      );
      toast.error(errorMessage);
      setDeletedFiles(deletedFilesState => deletedFilesState || null);
      setHasMoreDeletedFiles(false);
    } finally {
      setLoadingDeletedFiles(false);
    }
  }, [api, user]);

  useEffect(() => {
    fetchDeletedFiles();
    fetchDeletedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell>
      {(() => {
        if (
          (loadingDeletedProjects && !deletedProjects) ||
          (loadingDeletedFiles && !deletedFiles)
        ) {
          return (
            <StyledDimmer active inverted>
              <Loader>Loading Archive...</Loader>
            </StyledDimmer>
          );
        }

        if (!deletedProjects || !deletedFiles) {
          return (
            <Grid>
              <Grid.Row>
                <Grid.Column width="4">
                  <Message
                    error
                    header="Something went wrong"
                    content="Please try again"
                    icon="warning circle"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        }

        if (deletedProjects.length === 0 && deletedFiles.length === 0) {
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
                alt="Archived Projects"
                centered
                size="medium"
              />
              <h3>You don't have any deleted items!</h3>
            </StyledSegment>
          );
        }

        return (
          <ContentContainer>
            <Grid>
              {deletedProjects.length > 0 && (
                <React.Fragment>
                  <Grid.Row>
                    <Grid.Column>
                      <Header color="grey">Archived Projects</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Grid columns="4" stackable>
                        {deletedProjects.map(project => {
                          return (
                            <Grid.Column key={project.id}>
                              <DeletedProjectCard
                                project={project}
                                onRestore={() => {
                                  setDeletedProjects(deletedProjectsState =>
                                    deletedProjectsState.filter(
                                      projectItem =>
                                        projectItem.id !== project.id,
                                    ),
                                  );
                                }}
                              />
                            </Grid.Column>
                          );
                        })}
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                  {hasMoreDeletedProjects && (
                    <Grid.Row>
                      <Grid.Column width="14" />
                      <Grid.Column width="2">
                        <Button
                          size="mini"
                          loading={loadingDeletedProjects}
                          primary
                          basic
                          fluid
                          onClick={fetchDeletedProjects}
                        >
                          Load More
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </React.Fragment>
              )}
              {deletedFiles.length > 0 && (
                <React.Fragment>
                  <Grid.Row>
                    <Grid.Column>
                      <Header color="grey">Archived Files</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Table>
                        <StyledTableHeader>
                          <Table.Row>
                            <Table.HeaderCell>File Name</Table.HeaderCell>
                            <Table.HeaderCell>Project Name</Table.HeaderCell>
                            <Table.HeaderCell>Size</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                          </Table.Row>
                        </StyledTableHeader>
                        <Table.Body>
                          {deletedFiles.map(file => {
                            return (
                              <DeletedFileRow
                                file={file}
                                key={file.id}
                                onRestore={() => {
                                  setDeletedFiles(deletedFilesState =>
                                    deletedFilesState.filter(
                                      fileItem => fileItem.id !== file.id,
                                    ),
                                  );
                                }}
                              />
                            );
                          })}
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                  </Grid.Row>
                  {hasMoreDeletedFiles && (
                    <Grid.Row>
                      <Grid.Column width="14" />
                      <Grid.Column width="2">
                        <Button
                          size="mini"
                          loading={loadingDeletedFiles}
                          primary
                          basic
                          fluid
                          onClick={fetchDeletedFiles}
                        >
                          Load More
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </React.Fragment>
              )}
            </Grid>
          </ContentContainer>
        );
      })()}
    </AppShell>
  );
};

export default Archive;

const StyledSegment = styled(Segment)`
  width: 80%;
`;

const ContentContainer = styled.div`
  padding: 2em;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  @media ${mediaQuerySize.sm} {
    padding: 1em;
  }
`;

const StyledDimmer = styled(Dimmer)`
  background-color: transparent !important;
`;

const StyledTableHeader = styled(Table.Header)`
  @media ${mediaQuerySize.sm} {
    display: none !important;
  }
`;
