from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.dependencies.auth import get_current_user

from app.models.user import User

from app.schemas.portfolio import (
    PortfolioHoldingCreate,
    PortfolioHoldingUpdate,
    PortfolioHoldingResponse,
    
)

from app.services.portfolio_services import (
    create_holding,
    get_user_holdings,
    get_holding,
    update_holding,
    delete_holding,
)

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"],
)


@router.post(
    "",
    response_model=PortfolioHoldingResponse,
)
def add_holding(
    holding: PortfolioHoldingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_holding(
        db=db,
        user_id=current_user.id,
        data=holding,
    )


@router.get(
    "",
    response_model=list[PortfolioHoldingResponse],
)
def get_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_holdings(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/{holding_id}",
    response_model=PortfolioHoldingResponse,
)
def get_single_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holding = get_holding(
        db=db,
        holding_id=holding_id,
        user_id=current_user.id,
    )

    if not holding:
        raise HTTPException(
            status_code=404,
            detail="Holding not found",
        )

    return holding


@router.put(
    "/{holding_id}",
    response_model=PortfolioHoldingResponse,
)
def edit_holding(
    holding_id: int,
    data: PortfolioHoldingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holding = get_holding(
        db=db,
        holding_id=holding_id,
        user_id=current_user.id,
    )

    if not holding:
        raise HTTPException(
            status_code=404,
            detail="Holding not found",
        )

    return update_holding(
        db=db,
        holding=holding,
        data=data,
    )


@router.delete("/{holding_id}")
def remove_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holding = get_holding(
        db=db,
        holding_id=holding_id,
        user_id=current_user.id,
    )

    if not holding:
        raise HTTPException(
            status_code=404,
            detail="Holding not found",
        )

    delete_holding(
        db=db,
        holding=holding,
    )

    return {
        "message": "Holding deleted successfully"
    }