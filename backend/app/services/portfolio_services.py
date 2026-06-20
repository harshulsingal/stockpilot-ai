from sqlalchemy.orm import Session

from app.models.portfolio import PortfolioHolding
import yfinance as yf

def create_holding(
    db: Session,
    user_id: int,
    data
):
    ticker = data.ticker.upper()

    stock = yf.Ticker(ticker)

    company_name = stock.info.get(
        "longName",
        ticker
    )

    holding = PortfolioHolding(
        user_id=user_id,
        ticker=ticker,
        company_name=company_name,
        quantity=data.quantity,
        average_price=data.average_price,
        purchase_date=data.purchase_date,
    )

    db.add(holding)
    db.commit()
    db.refresh(holding)

    return holding

def get_user_holdings(
    db: Session,
    user_id: int,
):
    return (
        db.query(PortfolioHolding)
        .filter(
            PortfolioHolding.user_id == user_id
        )
        .all()
    )

def get_holding(
    db: Session,
    holding_id: int,
    user_id: int,
):
    return (
        db.query(PortfolioHolding)
        .filter(
            PortfolioHolding.id == holding_id,
            PortfolioHolding.user_id == user_id,
        )
        .first()
    )

def delete_holding(
    db: Session,
    holding: PortfolioHolding,
):
    db.delete(holding)
    db.commit()



def update_holding(
    db,
    holding,
    data,
):
    ticker = data.ticker.upper()

    stock = yf.Ticker(ticker)

    company_name = stock.info.get(
        "longName",
        ticker
    )

    holding.ticker = ticker
    holding.company_name = company_name
    holding.quantity = data.quantity
    holding.average_price = data.average_price
    holding.purchase_date = data.purchase_date

    db.commit()
    db.refresh(holding)

    return holding